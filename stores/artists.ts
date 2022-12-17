import { Artist } from "~/entities/artist";
import { Catalogue } from "~/entities/catalogue";
import { Release } from "~/entities/release";
import { Artists } from "~/server/api/artists";

type Block = {
  title: string;
  items: Artist[];
}

type Section = {
  [key: string]: Block;
}

export const useArtistsStore = defineStore('artists', () => {
  let artists = $ref<Artist[]>([]);
  let allArtists = $ref<Artist[]>([]);
  let catalogue: Catalogue[] = [];
  let lastUpdateAt = $ref<string>('');


  // Builds an alphabetically ordered indexed list of artists.
  const getSections = computed((): Block[] => {
    return Object.values(
      artists.reduce((acc: Section, item: Artist) => {
        let title: string = item.name[0].toLocaleUpperCase();

        if (!acc[title]) {
          acc[title] = { title, items: [item] };
        } else {
          acc[title].items.push(item);
        }

        return acc;
      }, {})
    );
  });

  // Filters (searches) artists previously stored in Pinia.
  function search(e: Event) {
    const query = (e.target as HTMLInputElement).value.toLowerCase();

    artists = allArtists.filter((artist: Artist) => artist.name.toLowerCase().indexOf(query) !== -1);
  }

  // Fetches all artists from the database and saves them in the store.
  async function fetchAll() {
    try {
      artists = await Artists.get(1);
      allArtists = artists;
      console.log('✔ Fetched artists');
    } catch (e) {
      console.error(e)
    }
  }

  function findInStore(artistId: string): Artist | undefined {
    return artists.find((artist: Artist) => artist.id === artistId);
  }

  // Finds a Pinia stored artist. If not found, fetches it from the database.
  async function fetchOrFindInStore(artistId: string) {
    let found = findInStore(artistId);

    if (found) {
      return found;
    }

    try {
      const result: Artist = await Artists.find(artistId);

      artists.push(result);

      return findInStore(artistId);
    } catch (e) {
      console.error(e)
    }
  }

  async function buildCatalogue(artistId: string) {
    const artist = await fetchOrFindInStore(artistId);

    if (artist) {
      if (!artist.catalogue?.length) {
        console.log('Catalogue isn\'t available yet. Fetching it from Musicbrainz...');

        let continueFetchingCatalogue: boolean = true;
        const limit: number = 100;
        let offset: number = 0;
        let data;

        while(continueFetchingCatalogue) {
          data = await fetchCatalogue(artist, offset, limit);

          if (data) {
            organizeCatalogue(data);

            if (!artist.catalogueCount || (offset + limit >= artist.catalogueCount)) {
              continueFetchingCatalogue = false;
            }
          }

          offset+=100;
        }

        sortCatalogue();

        // Update the artist with the catalogue
        artist.catalogue = catalogue;
      } else {
        console.log('Catalogue already in store, no need to fetch');
      }
    } else {
      console.error(`Could not find artist ${artistId}`)
    }

    return artist;
  }

  // Fetches the musicbrainz catalogue for a give artist.
  async function fetchCatalogue(artist: Artist, offset: number = 0, limit: number = 100) {
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release-group?query=arid:${artist.musicbrainzId}%20AND%20status:official&limit=${limit}&offset=${offset}&fmt=json`);
      const data = await response.json();

      if (!artist.catalogueCount) {
        artist.catalogueCount = +data.count;
      }

      return data['release-groups'];
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchCover(id: string) {
    const url = `http://coverartarchive.org/release/${id}`
    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  // Adds more data into the catalogue, indexed by primary type (album, ep).
  function organizeCatalogue(data: any) {
    data.forEach((item: Release) => {
      const type: string = item['primary-type'] ? item['primary-type'] : 'unknown';

      if (!catalogue[type]) {
        catalogue[type] = [];
      }

      catalogue[type].push(item);
    });
  }

  // Sorts the list of each primary type (album, ep...) in the catalogue.
  function sortCatalogue() {
    Object.keys(catalogue)
      .filter(key => key !== 'unknown')
      .forEach(key => {
        catalogue[key].sort((a: Release, b: Release): number => new Date(a['first-release-date']).valueOf() - new Date(b['first-release-date']).valueOf());
      });
  }

  return {
    artists,
    getSections,
    lastUpdateAt,
    search,
    fetchAll,
    fetchCatalogue,
    buildCatalogue,
  }
})
