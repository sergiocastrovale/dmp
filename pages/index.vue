<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists';

definePageMeta({
  withHeader: true,
});

const store = useArtistsStore();

useHead({
  title: `DMP - A music database`,
});

onMounted(async () => {
  await store.buildListing();
});
</script>

<template>
  <div class="index" :class="{ 'with-hint': store.selectedLetter }">
    <ul>
      <li
        v-for="(section, i) in store.alphabeticalList"
        :key="i"
        :class="{ selected: section.title === store.selectedLetter }"
        @click="store.filterByLetter(section.title)"
      >
        {{ section.title }}
      </li>
    </ul>

    <div
      v-if="store.hasLetterFilter"
      class="hint"
      @click="store.resetFilters()"
    >
      Back to the full list
    </div>
  </div>

  <section>
    <dl v-for="(section, i) in store.alphabeticalList" :key="i">
      <dt v-if="!store.hasLetterFilter && !store.hasQueryFilter">
        {{ section.title }}
      </dt>

      <dd v-for="artist in section.items" :key="artist.id">
        <NuxtLink :to="`/artists/${artist.id}`">
          {{ artist.name }}
        </NuxtLink>
      </dd>
    </dl>
  </section>
</template>

<style lang="scss" scoped>
.index {
  text-align: center;
  margin: 3rem 0 6rem;

  &.with-hint {
    margin-bottom: 3rem;
  }

  .hint {
    height: 2rem;
    margin-top: 1rem;
    color: var(--grey-200);
    cursor: pointer;
  }

  > ul {
    > li {
      display: inline-block;
      width: 5rem;
      height: 5rem;
      line-height: 5rem;
      padding: 2px;
      border-radius: 50%;
      text-transform: uppercase;
      font-weight: var(--font-weight-500);
      font-size: 2.75rem;
      color: var(--grey-200);
      cursor: pointer;

      &:hover {
        color: var(--grey-200);
        background: var(--grey-500);
      }

      &.selected {
        width: 5rem;
        height: 5rem;
        line-height: 5rem;
        font-size: 2.5rem;
        color: var(--white);
        background: var(--orange-300);

        &:hover {
          padding: 0;
          color: var(--orange-300);
          border: 2px solid var(--orange-300);
          background: transparent;
        }
      }
    }
  }
}

section {
  column-count: 1;
  column-gap: 1rem;
  margin: 1rem;

  > dl {
    margin-bottom: 1.5rem;

    > dt {
      display: inline-block;
      width: 5rem;
      height: 5rem;
      line-height: 5rem;
      margin: 0 0 1.5rem;
      font-size: 3rem;
      font-weight: var(--font-weight-500);
      text-transform: uppercase;
      color: var(--white);
      border-radius: 50%;
      background: var(--orange-300);
      text-align: center;
    }

    > dd {
      margin: 0 0 0.75rem 0;

      > a {
        display: block;
        padding: 2px 10px;
        line-height: 5rem;
        border-radius: 6px;
        background: var(--grey-600);

        &:hover {
          padding: 0 8px;
          border: 2px solid var(--orange-300);
        }
      }
    }
  }

  @media screen and (min-width: 640px) {
    column-count: 2;
  }

  @media screen and (min-width: 860px) {
    column-count: 3;

    > dl {
      > dt {
        width: var(--letter-block-size);
        height: var(--letter-block-size);
        line-height: var(--letter-block-size);
        font-size: 2.5rem;
      }

      > dd {
        margin: 0 0 0.35rem 0;

        > a {
          line-height: 3.5rem;
        }
      }
    }
  }

  @media screen and (min-width: 1200px) {
    column-count: 4;
  }

  @media screen and (min-width: 1450px) {
    column-count: 5;
  }

  @media screen and (min-width: 1960px) {
    column-count: 6;
  }

  @media screen and (min-width: 2320px) {
    column-count: 7;
  }

  @media screen and (min-width: 2560px) {
    column-count: 8;
  }
}
</style>
