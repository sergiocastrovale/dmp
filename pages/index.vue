<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();

onMounted(async () => {
  if (!store.artists?.length) {
    await store.fetchAll();
  }
})
</script>

<template>
  <section>
    <dl v-for="(section, i) in store.getSections" :key="i">
      <dt>{{ section.title }}</dt>
      <dd v-for="artist in section.items">
        <NuxtLink :to="`/artists/${artist.id}`">
          {{ artist.name }}
        </NuxtLink>
      </dd>
    </dl>
  </section>
</template>
