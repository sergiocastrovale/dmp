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

<style lang="scss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.75rem;
  margin: 1rem;

  > dl > dt {
    display: inline-block;
    width: var(--letter-block-size);
    height: var(--letter-block-size);
    line-height: var(--letter-block-size);
    margin: 0 0 0.75rem;
    font-size: 22px;
    font-weight: var(--font-weight-500);
    text-transform: uppercase;
    color: var(--white);
    border-radius: 50%;
    background: var(--orange-300);
    text-align: center;
  }

  > dl > dd {
    margin: 0.25rem 0;

    > a {
      display: block;
      padding: 2px 10px;
      line-height: 3rem;
      border-radius: 6px;
      background: var(--grey-600);

      &:hover {
        padding: 0 8px;
        border: 2px solid var(--orange-300);
      }
    }
  }

  @media screen and (min-width: 640px) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--min-column-width), 1fr)
    );
    grid-template-columns: repeat(
      auto-fit,
      minmax(var(--min-column-width), 1fr)
    );
  }
}
</style>
