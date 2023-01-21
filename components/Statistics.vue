<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();

const statisticsReady = computed(() => store.artistsCount && store.directoriesCount);

const statistics = computed(() => ([
  { key: 'artists', label: store.artistsCount, icon: 'uil:users-alt', alt: `${store.artistsCount} artists in the database` },
  { key: 'directories', label: store.directoriesCount, icon: 'uil:database', alt: `${store.artistsCount} directories scanned` },
  { key: 'update', label: store.lastUpdate, icon: 'uil:clock', alt: `Last updated ${store.lastUpdate}` },
]));

onMounted(async () => {
  await store.buildListing();
})
</script>

<template>
  <div class="details">
    <div class="statistics" v-if="statisticsReady">
      <span v-for="statistic in statistics" :key="statistic.key" :title="statistic.alt">
        <Icon :name="statistic.icon" /> {{ statistic.label }}
      </span>
    </div>

    <div class="credits">
      <NuxtLink to="https://github.com/sergiocastrovale/dmp" target="_blank">
        <Icon name="uil:github" size="22" />
      </NuxtLink>
    </div>
  </div>
</template>
