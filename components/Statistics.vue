<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists';

const store = useArtistsStore();

const statisticsReady = computed(
  () => store.artistsCount && store.directoriesCount,
);

const statistics = computed(() => [
  {
    key: 'update',
    label: store.lastUpdate,
    icon: 'uil:clock',
    alt: `Last updated ${store.lastUpdate}`,
  },
  {
    key: 'directories',
    label: store.directoriesCount,
    icon: 'uil:database',
    alt: `${store.directoriesCount} directories scanned`,
  },
  {
    key: 'artists',
    label: store.artistsCount,
    icon: 'uil:users-alt',
    alt: `${store.artistsCount} artists in the database`,
  },
]);

onMounted(async () => {
  await store.buildListing();
});
</script>

<template>
  <div v-if="statisticsReady" class="statistics">
    <span
      v-for="statistic in statistics"
      :key="statistic.key"
      :title="statistic.alt"
    >
      <Icon :name="statistic.icon" /> {{ statistic.label }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.statistics {
  display: flex;
  gap: 0.5rem;

  > span {
    display: flex;
    align-items: center;

    > svg {
      margin-right: 0.25rem;
    }
  }
}
</style>
