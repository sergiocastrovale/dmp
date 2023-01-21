import slugify from "slugify";
import { MusicBrainzApi } from 'musicbrainz-api';
import catalogue from "../../dump/catalogue.json" assert { type: "json" };
import type { Artist } from '../../entities/artist';
import type { LocalCatalogue } from '../../entities/localCatalogue';
import type { LocalRelease } from '../../entities/localRelease';
import type { MusicbrainzArtist } from '../../entities/musicbrainzArtist';
import { Artists } from "../api/artists";
import { Listings } from "../api/listings";
import config from '../../config/musicbrainz';

// https://www.npmjs.com/package/musicbrainz-api
const getArtistFromMusicbrainz = async (name: string): Promise<MusicbrainzArtist> => {
  const api = new MusicBrainzApi(config);
  const data = await api.searchArtist({ query: name });

  return { musicbrainzId: data?.artists?.length ? data.artists[0].id : '0' };
}

const buildDateTime = (): string => {
  const date = new Date();
  return `${date.getFullYear()}/${(date.getMonth()+1)}/${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const loadData = async(includeCatalogue:boolean = false): Promise<void> => {
  let flatList = '';
  let artistsCount = 0;
  let directoriesCount = 0;

  try {
    for (const n0 of catalogue) {
      // Root node: the folder where the collection is
      if (n0.type === 'directory' && n0.contents?.length) {

        // 1st level nodes: artists
        for (const n1 of n0.contents) {
          const name = n1.name;
          const { musicbrainzId } = await getArtistFromMusicbrainz(name);
          const id = slugify(name, { lower: true, strict: true, locale: 'en' });
          const localCatalogue: LocalCatalogue = {};

          if (n1.type === 'directory' && n1.contents?.length) {
            // level 2 - format folder (albums, EPs, live...)
            for (const n2 of n1.contents) {
              localCatalogue[n2.name] = [];

              if (n2.type === 'directory' && n2.contents?.length) {
                // level 3 - each album, EP...
                for (const n3 of n2.contents) {
                  localCatalogue[n2.name].push(<LocalRelease>{
                    title: n3.name,
                  });
                }
              }
            }
          }

          const artist: Artist = {
            id,
            name,
            musicbrainzId,
            localCatalogue,
          };

          flatList += `<${artist.name}|${artist.musicbrainzId}>`;

          await Artists.set(id, artist);

          console.log(`* Processed ${name}`);
          artistsCount++;
        }
      } else if (n0.type === 'report' && n0.directories) {
        directoriesCount = n0.directories;
      }
    }

    console.log('\x1b[32m', `✔ Added ${artistsCount} artists to the database (${directoriesCount} directories scanned).` ,'\x1b[0m');

    await Listings.set({
      catalogue: flatList,
      lastUpdate: buildDateTime(),
      artistsCount,
      directoriesCount
    });

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

loadData();
