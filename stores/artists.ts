import slugify from 'slugify';
import { Artist } from '~/entities/artist';
import { Catalogue } from '~/entities/catalogue';
import { Release } from '~/entities/release';
import { Artists } from '~/server/api/artists';
import { Listing } from '~~/entities/listing';
import { Listings } from '~~/server/api/listings';

type Block = {
  title: string;
  items: Artist[];
};

type Section = {
  [key: string]: Block;
};

type Statistics = Omit<Listing, 'catalogue'>;

interface ArtistsState {
  artists: Artist[];
  allArtists: Artist[];
  catalogue: Catalogue[];
  statistics: Statistics;
  selectedLetter: string;
  query: string;
}

export const useArtistsStore = defineStore('artists', {
  state: (): ArtistsState => ({
    artists: [],
    allArtists: [],
    catalogue: [],
    statistics: {
      artistsCount: 0,
      directoriesCount: 0,
      lastUpdate: '',
    },
    selectedLetter: '',
    query: '',
  }),
  getters: {
    directoriesCount: (state: any): number =>
      state.statistics.directoriesCount || 0,

    artistsCount: (state: any): string =>
      state.artists.length !== state.statistics.artistsCount
        ? `${state.artists.length} / ${state.statistics.artistsCount}`
        : `${state.statistics.artistsCount}`,

    lastUpdate: (state: any) => state.statistics.lastUpdate || 0,

    // Builds an alphabetically ordered indexed list of artists.
    alphabeticalList: (state: any): Block[] =>
      Object.values(
        state.artists.reduce((acc: Section, item: Artist) => {
          const title: string = item.name[0].toLocaleUpperCase();

          if (!acc[title]) {
            acc[title] = { title, items: [item] };
          } else {
            acc[title].items.push(item);
          }

          return acc;
        }, {}),
      ),

    hasQueryFilter: (state: any): boolean => !!state.query.length,

    hasLetterFilter: (state: any): boolean => !!state.selectedLetter.length,
  },
  actions: {
    // Filters (searches) artists previously stored in Pinia by text.
    search() {
      let filtered: Artist[] = [];
      const query = this.query.toLowerCase();

      filtered = this.allArtists.filter(
        (artist: Artist) => artist.name.toLowerCase().indexOf(query) !== -1,
      );

      if (this.hasLetterFilter) {
        filtered = this.useLetterFilter(filtered);
      }

      this.artists = filtered;
    },

    // Filters (searches) artists previously stored in Pinia by letter.
    filterByLetter(letter: string) {
      if (letter && letter !== this.selectedLetter) {
        this.selectedLetter = letter;
        this.artists = this.useLetterFilter(this.allArtists);
      }
    },

    // Auxiliary function holding the letter filter.
    useLetterFilter(list: Artist[]) {
      return list.filter(
        (artist: Artist) =>
          artist.name.toLowerCase().charAt(0) ===
          this.selectedLetter.toLowerCase(),
      );
    },

    // Resets all filters.
    resetFilters() {
      console.log('reset');
      this.selectedLetter = '';
      this.artists = [...this.allArtists];
    },

    // In order to avoid going above the 50.000 maximum document size Firestore allows for the free tier,
    // we have grouped together all artists + their Musicbrainz ID in a big string, in the format
    // <artist name|id><artist name 2|id>...
    // This function parses that into proper Artists.
    async buildListing() {
      try {
        const { catalogue, artistsCount, directoriesCount, lastUpdate } =
          await Listings.get();
        const matches: any = catalogue.match(/<(.*?)>/g);

        this.allArtists = matches.map((match: string) => {
          const parts = match.slice(1, -1).split('|');

          return {
            id: slugify(parts[0], { lower: true, strict: true, locale: 'en' }),
            name: parts[0],
            musicbrainzId: parts[1],
          };
        });

        this.artists = [...this.allArtists];

        this.statistics = {
          artistsCount,
          directoriesCount,
          lastUpdate,
        };
      } catch (e) {
        console.error(e);
      }
    },
    findInStore(artistId: string): Artist | undefined {
      return this.artists.find(
        (artist: Artist) => artist.id === artistId && artist.localCatalogue,
      );
    },

    // Finds a Pinia stored artist. If not found, fetches it from the database.
    async fetchOrFindInStore(artistId: string) {
      const found = this.findInStore(artistId);

      if (found) {
        console.log('found :>> ', found);
        return found;
      }

      try {
        const result: Artist = await Artists.find(artistId);

        this.artists.push(result);

        return this.findInStore(artistId);
      } catch (e) {
        console.error(e);
      }
    },

    async buildCatalogue(artistId: string) {
      const artist = await this.fetchOrFindInStore(artistId);

      if (artist) {
        if (!artist.catalogue?.length) {
          console.log(
            "Catalogue isn't available yet. Fetching it from Musicbrainz...",
          );

          let continueFetchingCatalogue = true;
          const limit = 100;
          let offset = 0;
          let data;

          while (continueFetchingCatalogue) {
            data = await this.fetchCatalogue(artist, offset, limit);

            if (data) {
              this.organizeCatalogue(data);

              if (
                !artist.localCatalogueCount ||
                offset + limit >= artist.localCatalogueCount
              ) {
                continueFetchingCatalogue = false;
              }
            }

            offset += 100;
          }

          this.sortCatalogue();

          // Update the artist with the catalogue
          artist.catalogue = this.catalogue;
        } else {
          console.log('Catalogue already in store, no need to fetch');
        }
      } else {
        console.error(`Could not find artist ${artistId}`);
      }

      return artist;
    },

    // Fetches the musicbrainz catalogue for a give artist.
    async fetchCatalogue(artist: Artist, offset = 0, limit = 100) {
      if (!artist.musicbrainzId) {
        throw new Error('Invalid Musicbrainz ID!');
      }

      try {
        // const { api } = await useMusicBrainz();
        // const query = `query='arid:${artist.musicbrainzId} AND status:official'`;
        // const result = await api.search('release-group', {
        //   query,
        //   offset,
        //   limit,
        // });

        const response = await fetch(
          `https://musicbrainz.org/ws/2/release-group?query=arid:${artist.musicbrainzId}%20AND%20status:official&limit=${limit}&offset=${offset}&fmt=json`,
        );
        const data = await response.json();

        if (!artist.localCatalogueCount) {
          artist.localCatalogueCount = +data.count;
        }

        return data['release-groups'];
      } catch (e) {
        console.error(e);
      }
    },

    // async fetchCover(id: string) {
    //   const url = `http://coverartarchive.org/release/${id}`;
    //   const response = await fetch(url);
    //   const data = await response.json();

    //   return data;
    // },

    // Adds more data into the catalogue, indexed by primary type (album, ep).
    organizeCatalogue(data: any) {
      data.forEach((item: Release) => {
        const type: string = item['primary-type']
          ? item['primary-type']
          : 'unknown';

        if (!this.catalogue[type]) {
          this.catalogue[type] = [];
        }

        this.catalogue[type].push(item);
      });
    },

    // Sorts the list of each primary type (album, ep...) in the catalogue.
    sortCatalogue() {
      Object.keys(this.catalogue)
        .filter((key) => key !== 'unknown')
        .forEach((key) => {
          this.catalogue[key].sort(
            (a: Release, b: Release): number =>
              new Date(a['first-release-date']).valueOf() -
              new Date(b['first-release-date']).valueOf(),
          );
        });
    },
  },
});
