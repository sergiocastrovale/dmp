# DMP2 (formerly discodomeuprimo)

Source code for https://discodomeuprimo.lol, a comprehensive and heavily biased catalogue of artists and bands worth knowing about.

## Tech stack

- Nuxt 3
- Typescript
- Pinia
- Musicbrainz API
- Firebase / Firestore
- Netlify

## Commands

**Run project**

`yarn dev`

Runs the project locally (defaults to port `3000`).

**Build**

`bash build.sh`

Reads local files based on the path provided in `.env` and builds a JSON file with the directory tree (by using `tree`).

The JSON dump is stored in `dumps/[timestamp].json`.

**Sync**

`yarn sync`

1. Reads the JSON file previously created with `build.sh`
2. Calls Musicbrainz's API so that we can get the unique ID of the artist from their database (in case of multiple findings, assumes that the one with highest score is the one we want)
3. Builds each `Artist` with all the information
4. Synchronizes the Firestore database with the new artist (overwrites it if the artist already exists)

Alternatively, you can force the sync process to only begin with a certain letter (e.g. if the script failed somewhere in the middle of the list) with:

```bash
# Start scanning from the letter n
yarn sync --from=n
```

## How does it work?

### The local catalogue

The files stored in the `BASE_PATH` you have set in `.env` are read with `bash build.sh`, stored in a JSON file, and then, by running `yarn sync`, each of the artists is stored in the database (Firestore), along with its catalogue.

In order for this to work, a strict structure must be met:

```
/[your BASE_PATH]
/[your BASE_PATH]/A Perfect Circle
/[your BASE_PATH]/A Perfect Circle/Albums
/[your BASE_PATH]/A Perfect Circle/Albums/2000 - Mer de Noms
/[your BASE_PATH]/A Perfect Circle/Boxset & Compilations/
/[your BASE_PATH]/A Perfect Circle/Boxset & Compilations/2004 - aMOTION (rEMIXED)
```

### The official catalogue

We read the official catalogue in real-time from Musicbrainz - it isn't stored in our database, since that would prevent us to have it consistently up-to-date.

We are able to do this because `yarn sync` attempts to find each artist (folder name) in Musicbrainz API and we store its unique Musicbrainz ID in our database - thus allowing us to have a link between our local catalogue and the "remote" one.

## To do

### API

- Refactor the direct approach to also use `musicbrainz-api` (better type support, throttling)

- Save artist description and external links in our database, since we are making a request when running `yarn sync` anyway and this information will unlikely change too often

### Catalogue management

### Local catalogue

- Normalize the whole catalogue so that EVERY album follows the `[year] - [name]` folder convention

### UI

### List page

- Lowercase artist names should appear in alphabetical order as if they were uppercase (not at the end of the list)

### Catalogue page

- Include artist description, external links

- Allow togging local / official panels

- Download album covers from `coverartarchive.org`

### Misc

- Decent loading states

### Infrastructure

- Move the conversion from Listing to object map to a centralized location (code duplication in `nuxt.config.ts` and `index.vue`)

- Organize types and interfaces better
