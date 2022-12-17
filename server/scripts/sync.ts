import slugify from "slugify";
import { MusicBrainzApi } from 'musicbrainz-api';
import list from "../../dump/list.json" assert { type: "json" };
import type { Artist } from '../../entities/artist';
import type { LocalCatalogue } from '../../entities/localCatalogue';
import type { LocalRelease } from '../../entities/localRelease';
import type { MusicbrainzArtist } from '../../entities/musicbrainzArtist';
import { Artists } from "../api/artists";
import config from '../../config/musicbrainz';

// https://www.npmjs.com/package/musicbrainz-api
const getArtistFromMusicbrainz = async (name: string): Promise<MusicbrainzArtist> => {
  const api = new MusicBrainzApi(config);
  const data = await api.searchArtist({ query: name });

  return { musicbrainzId: data?.artists?.length ? data.artists[0].id : '0' };
}

const loadData = async(includeCatalogue:boolean = false): Promise<void> => {
  let count = 0;

  try {
    for (const n0 of list) {
      // Root node: the folder where the collection is
      if (n0.type === 'directory' && n0.contents?.length) {

        // 1st level nodes: artists
        for (const n1 of n0.contents) {
          const name = n1.name;
          const { musicbrainzId } = await getArtistFromMusicbrainz(name);
          const id = slugify(name, { lower: true, strict: true, locale: 'en' });
          const localCatalogue: LocalCatalogue = {};

          // level 2 - format folder (albums, EPs, live...)
          for (const n2 of n1.contents) {
            localCatalogue[n2.name] = [];

            // level 3 - each album, EP...
            for (const n3 of n2.contents) {
              localCatalogue[n2.name].push(<LocalRelease>{
                title: n3.name,
              });
            }
          }

          const artist: Artist = {
            id,
            name,
            musicbrainzId,
            localCatalogue,
          };

          await Artists.set(id, artist);

          console.log(`* Processed ${name}`);
          count++;
          break;
        };
      }
    }

    console.log('\x1b[32m', `✔ Added ${count} artists to the database` ,'\x1b[0m');

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

loadData();
