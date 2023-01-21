# DMP2 (formerly discodomeuprimo)

Source code for https://discodomeuprimo.lol, a comprehensive and heavily biased catalogue of artists and bands worth knowing about.

## Tech stack

* Nuxt 3
* Typescript
* Pinia
* Musicbrainz API
* Firebase / Firestore
* Netlify

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

We read the official catalogue as we need so - it isn't stored in our database, since that would prevent us to have it consistently up-to-date.

To do this, we use Musicbrainz API, and fetch the catalogue of the given artist when browsing the artist's page. We are able to do this because `yarn sync` attempts to find each artist (folder name) in Musicbrainz API and we store its unique Musicbrainz ID in our database - thus allowing us to have a link between our local catalogue and the "remote" one.

## To do

### API

* Consider ditching `musicbrainz-api` in favor of a direct fetch from the URL
* ... OR refactor the direct approach to also use `musicbrainz-api` (better type support)
* Requests should only be done ONCE and stored in Pinia - all subsequent needs should get info from Pinia

### Catalogue management

**Official catalogue**

* Download album covers from `coverartarchive.org`

**Local catalogue**

✔ Normalize 2nd level folders (Albums, Singles, EPs, Compilations, Remastered, Box Set, Live, Other)

✔ Expanded mode (export catalogue to json file)

✔ Sync local catalogue with Firebase

### UI

✔ Build side-by-side official vs. local catalogue viewer

✔ Implement search (similar to v1 but with Pinia)

* Decent loading states

* Search bar is overflowing in mobile view

### Features

* Add social media from Musicbrainz API
* Add artist description from Musicbrainz API

### Infrastructure

* Properly setup ESLint + Prettier
* Move the conversion from Listing to object map to a centralized location (code duplication in `nuxt.config.ts` and `index.vue`)
