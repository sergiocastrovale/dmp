<script setup lang="ts">
import type { Artist } from '../../entities/artist';
import { useArtistsStore } from '@/stores/artists';

const store = useArtistsStore();

let isReady = $ref<boolean>(false);
let artist = $ref<Artist>();

useHead({
  title: artist?.name ? `DMP2 - ${artist.name}` : 'DMP2',
});

onMounted(() => {
  prepareArtistCatalogue();
});

async function prepareArtistCatalogue() {
  const router = useRouter();
  await router.isReady();

  const artistId = router.currentRoute.value.params.id;

  try {
    if (artistId && typeof artistId === 'string') {
      artist = await store.buildCatalogue(artistId);
    } else {
      throw new Error('Invalid artist ID!');
    }
  } catch (e) {
    console.error(e);
  } finally {
    isReady = true;
  }
}
</script>

<template>
  <Loading v-if="!isReady" />

  <template v-else>
    <div v-if="artist" class="artist-page">
      <header>
        <div class="title">
          <Back />

          <h1>{{ artist.name }}</h1>

          <NuxtLink
            :to="`https://musicbrainz.org/artist/${artist.musicbrainzId}`"
            target="_blank"
          >
            MusicBrainz
          </NuxtLink>

          <NuxtLink
            v-if="artist.wikipedia?.url"
            :to="artist.wikipedia.url"
            target="_blank"
          >
            Wikipedia
          </NuxtLink>
        </div>

        <div v-if="artist.wikipedia?.summary" class="summary">
          {{ artist.wikipedia.summary }}
        </div>
      </header>

      <section>
        <ArtistOfficialCatalogue :catalogue="artist.catalogue" />
        <ArtistLocalCatalogue :catalogue="artist?.localCatalogue" />
      </section>
    </div>

    <ArtistNotFound v-else />
  </template>
</template>

<style lang="scss" scoped>
.artist-page {
  header {
    background: var(--grey-600);
    padding: 1.5rem;

    > .summary {
      margin: 2rem 0;
      font-size: 1.5rem;
      line-height: 2.75rem;
    }
  }

  :deep(section) {
    display: grid;
    gap: 1.5rem;

    .catalogue {
      margin: 0 1.5rem;

      .types {
        display: flex;
        gap: 0.75rem;
        margin: 1.5rem 0;

        > li {
          min-width: 50px;
          padding: 0 1.25rem;
          line-height: 3.25rem;
          text-align: center;
          border-radius: 3rem;
          border: 1px solid var(--grey-300);
          background: var(--white);
          cursor: pointer;

          &:hover {
            background: var(--grey-600);
          }

          &.active {
            border-color: var(--orange-300);
            color: var(--white);
            background: var(--orange-300);

            &:hover {
              cursor: unset;
            }
          }
        }
      }

      .catalogue-format {
        display: none;

        &.active {
          display: block;
        }

        .release {
          display: block;
          min-height: 45px;
          font-size: 1.5rem;
          line-height: 2.75rem;
          padding: 0.75rem 1rem;
          margin: 0.5rem 0;
          background: var(--grey-600);
          border-radius: 6px;

          > strong {
            display: block;
          }

          .more {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            line-height: 1rem;
            margin-top: 0.35rem;

            > .secondary-formats {
              display: flex;
              gap: 0.25rem;

              > li {
                padding: 0.5rem 0.75rem;
                border-radius: 1rem;
                color: var(--white);
                background: var(--grey-200);
              }
            }
          }
        }

        a.release {
          cursor: pointer;

          &:hover {
            background: var(--grey-500);
          }
        }
      }
    }

    @media screen and (min-width: 640px) {
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(--min-column-width), 1fr)
      );
    }
  }
}
</style>
