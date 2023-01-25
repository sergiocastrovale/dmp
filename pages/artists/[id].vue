<script setup lang="ts">
import type { Artist } from '../../entities/artist';
import { useArtistsStore } from '@/stores/artists';

const store = useArtistsStore();

let isReady = $ref<boolean>(false);
let artist = $ref<Artist>();

useHead({
  title: artist?.name ? `DMP2 - ${artist.name}` : 'DMP2',
});

onMounted(async () => {
  prepareArtistCatalogue();
});

async function prepareArtistCatalogue() {
  const router = useRouter();
  await router.isReady();

  const artistId = router.currentRoute.value.params.id;

  if (artistId && typeof artistId === 'string') {
    artist = await store.buildCatalogue(artistId);
  }

  isReady = true;
}
</script>

<template>
  <Loading v-if="!isReady" />

  <template v-else>
    <div v-if="artist" class="artist-page">
      <div class="title">
        <Back />

        <h1>{{ artist.name }}</h1>

        <NuxtLink
          :to="`https://musicbrainz.org/artist/${artist.musicbrainzId}`"
          target="_blank"
        >
          MusicBrainz
        </NuxtLink>
      </div>

      <section>
        <ArtistOfficialCatalogue :catalogue="artist.catalogue" />
        <ArtistLocalCatalogue :catalogue="artist?.localCatalogue" />
      </section>
    </div>

    <ArtistNotFound v-else />
  </template>
</template>
