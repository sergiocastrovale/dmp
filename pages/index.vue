<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists';

definePageMeta({
  withHeader: true,
});

const store = useArtistsStore();

useHead({
  title: `DMP2 - A music database`,
});

onMounted(async () => {
  await store.buildListing();
});
</script>

<template>
  <section>
    <dl v-for="(section, i) in store.getSections" :key="i">
      <dt>{{ section.title }}</dt>
      <dd v-for="artist in section.items" :key="artist.id">
        <NuxtLink :to="`/artists/${artist.id}`">
          {{ artist.name }}
        </NuxtLink>
      </dd>
    </dl>
  </section>
</template>
