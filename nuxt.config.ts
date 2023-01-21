import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { Listings } from "./server/api/listings";
import slugify from "slugify";

// we need the root node modules where packages are hoisted
const nodeModules = fileURLToPath(
  new URL('./node_modules', import.meta.url)
)

export default defineNuxtConfig({
  app: {
    head: {
      title: 'DMP2',
      meta: [
        { name: 'viewport', content: 'width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;500;700&display=swap'
        }
      ]
    },
  },
  css: [
    '~/assets/styles/all.scss',
  ],
  hooks: {
    // // https://github.com/nuxt/nuxt/issues/13949#issuecomment-1397322945
    async 'nitro:config' (nitroConfig) {
      if (nitroConfig.dev) {
        return;
      }

      let routes: any = [];

      try {
        const { catalogue } = await Listings.get();
        const matches: any = catalogue.match(/<(.*?)>/g);

        routes = matches.map((match: string) => {
          const parts = match.slice(1, -1).split('|');
          const id = slugify(parts[0], { lower: true, strict: true, locale: 'en' });

          if (nitroConfig.prerender?.routes) {
            nitroConfig.prerender.routes.push(`/artists/${id}`);
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    // https://github.com/nuxt/framework/issues/6690#issuecomment-1330773397
    'vite:extendConfig': (config, { isServer }) => {
      if (isServer) {
        config.resolve ??= {}
        config.resolve.alias ??= {}
        // @ts-ignore
        config.resolve.alias['firebase/firestore'] = resolve(
          nodeModules,
          'firebase/firestore/dist/index.mjs'
        )
        // @ts-ignore
        config.resolve.alias['@firebase/firestore'] = resolve(
          nodeModules,
          '@firebase/firestore/dist/index.node.mjs'
        )
      }
    },
  },
  experimental: {
    reactivityTransform: true
  },
  generate: {
    routes: [
      '/artists/:id',
    ]
  },
  modules: [
    'nuxt-icon',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore',
          'storeToRefs'
        ],
      },
    ],
  ],
})
