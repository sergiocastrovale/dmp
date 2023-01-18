<script setup lang="ts">
import type { Artist } from "../../entities/artist";
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();
let artist = $ref<Artist>();

onMounted(async () => {
  const router = useRouter();
  await router.isReady();

  const artistId = router.currentRoute.value.params.id;

  if (artistId && typeof artistId === 'string') {
    artist = await store.buildCatalogue(artistId);
  }
});
</script>

<template>
<div class="artist-page" v-if="artist">
  <div class="title">
    <NuxtLink to="/" class="back">
    <strong>&larr; Back</strong>
  </NuxtLink>

    <h1>{{ artist.name }}</h1>

    <NuxtLink :to="`https://musicbrainz.org/artist/${artist.musicbrainzId}`" target="_blank">
      MusicBrainz
    </NuxtLink>
  </div>

  <section>
    <officialCatalogue :catalogue="artist.catalogue" />
    <localCatalogue :catalogue="artist?.localCatalogue" />
  </section>
</div>

<div v-else>No artist</div>
</template>
