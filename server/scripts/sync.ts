import fetch from 'node-fetch';
import slugify from 'slugify';
import { MusicBrainzApi } from 'musicbrainz-api';
import catalogue from '../../dump/catalogue.json' assert { type: 'json' };
import type { Artist } from '../../entities/artist';
import type { LocalCatalogue } from '../../entities/localCatalogue';
import type { LocalRelease } from '../../entities/localRelease';
import type { MusicbrainzArtist } from '../../entities/musicbrainzArtist';
import { Wikipedia } from '../../entities/wikipedia';
import { Artists } from '../api/artists';
import { Listings } from '../api/listings';
import config from '../../config/musicbrainz';

// https://www.npmjs.com/package/musicbrainz-api
const getArtistFromMusicbrainz = async (
  name: string,
): Promise<MusicbrainzArtist> => {
  const api = new MusicBrainzApi(config);
  const data = await api.searchArtist({ query: name });
  return { musicbrainzId: data?.artists?.length ? data.artists[0].id : '0' };
};

const buildWikipediaFromWikidata = async (wikidataId: string) => {
  const dbpediaResponse = await fetch(
    `http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+wd%3A+%3Chttp%3A%2F%2Fwww.wikidata.org%2Fentity%2F%3E+%0D%0ASELECT+%3FwikiPageID+WHERE+%7B%0D%0A%3Fdbpedia_id+owl%3AsameAs+%3Fwikidata_id++.%0D%0A%3Fdbpedia_id+dbo%3AwikiPageID+%3FwikiPageID+.%0D%0AVALUES+%28%3Fwikidata_id%29+%7B%28wd%3A${wikidataId}%29%7D+%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query`,
  );
  const dbpedia: any = await dbpediaResponse.json();
  const wikipediaId =
    dbpedia?.results?.bindings?.[0]?.wikiPageID?.value || null;
  let url = '';
  let summary = '';
  let pageId = 0;

  if (wikipediaId) {
    url = `https://en.wikipedia.org/?curid=${wikipediaId}`;

    const wikipediaResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${wikipediaId}`,
    );
    const wikipedia: any = await wikipediaResponse.json();

    if (wikipedia?.query?.pages) {
      const trim: any = Object.values(wikipedia?.query.pages);

      pageId = trim[0].pageid || 0;
      summary = trim[0].extract || '';
    }
  }

  return { url, summary, pageId };
};

const buildWikipediaUrl = async (data: any) => {
  const wikidata = data.find((item: any) =>
    item?.url?.resource.includes('wikidata'),
  );

  // Get the last part of the URL (the unique wikidata ID we need to build the corresponding wikipedia URL).
  if (wikidata) {
    const last = new URL(wikidata.url.resource).pathname.split('/').pop();

    if (last) {
      const wikipedia: Wikipedia = await buildWikipediaFromWikidata(last);
      return wikipedia;
    }
  }

  return null;
};

const buildUrls = async (data: any) => {
  const wantedUrls = [
    { priority: 1, name: 'Spotify', pattern: 'open.spotify.com/artist' },
    { priority: 2, name: 'Deezer', pattern: 'deezer.com/artist' },
    { priority: 3, name: 'Amazon Music', pattern: 'music.amazon.com' },
    { priority: 4, name: 'Youtube', pattern: 'youtube.com' },
    { priority: 5, name: 'iTunes', pattern: 'itunes.apple.com' },
    { priority: 6, name: 'Last.fm', pattern: 'last.fm/music' },
  ];

  const details: any = [];

  // Add only the URLs we need to the list and discard the rest (as well as unnecessary data).
  data.forEach((resource: any) => {
    if (resource.url?.resource) {
      const found = wantedUrls.filter(({ pattern }: any) =>
        resource.url.resource.includes(pattern),
      );

      if (found?.length) {
        const name = found[0].name;
        const type = resource?.type || 'unknown';
        const url = resource?.url?.resource;

        details.push({
          name,
          type,
          url,
        });
      }
    }
  });

  return details;
};

const buildArtistDetails = async (musicbrainzId: string) => {
  const api = new MusicBrainzApi(config);
  const data: any = await api.lookupArtist(musicbrainzId, ['url-rels']);
  let filteredData = [];

  if (data?.relations) {
    filteredData = data.relations.filter(
      (relation: any) => relation['target-type'] === 'url',
    );

    const urls = await buildUrls(filteredData);
    const wikipedia = await buildWikipediaUrl(filteredData);

    if (wikipedia) {
      return { urls, wikipedia };
    }

    return { urls };
  }

  return {};
};

const buildDateTime = (): string => {
  return new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000,
  )
    .toISOString()
    .substring(0, 19)
    .replace('T', ' ');
};

const loadData = async (): Promise<void> => {
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
          const extra = await buildArtistDetails(musicbrainzId);
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
            ...extra,
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

    console.log(
      '\x1B[32m',
      `✔ Added ${artistsCount} artists to the database (${directoriesCount} directories scanned).`,
      '\x1B[0m',
    );

    await Listings.set({
      catalogue: flatList,
      lastUpdate: buildDateTime(),
      artistsCount,
      directoriesCount,
    });

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

loadData();
