import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { Artists } from "./server/api/artists";

// we need the root node modules where packages are hoisted
const nodeModules = fileURLToPath(
  new URL('./node_modules', import.meta.url)
)

export default defineNuxtConfig({
  css: ['~/assets/scss/all.scss'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;500&display=swap'
        }
      ]
    },
  },
  hooks: {
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
  modules: [
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
