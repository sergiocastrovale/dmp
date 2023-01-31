<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists';

definePageMeta({
  withHeader: true,
});

const store = useArtistsStore();
let selectedLetter = $ref<string>('');
let showSectionTitles = $ref<boolean>(true);
let showHint = $ref<boolean>(false);

useHead({
  title: `DMP2 - A music database`,
});

onMounted(async () => {
  await store.buildListing();
});

function filterList(letter: string) {
  if (letter === selectedLetter) {
    store.resetFilters();
    selectedLetter = '';
    showSectionTitles = true;
    showHint = false;
  } else {
    store.filterByLetter(letter);
    selectedLetter = letter;
    showSectionTitles = false;
  }
}

function toggleHint() {
  if (!showSectionTitles) {
    showHint = !showHint;
  }
}
</script>

<template>
  <div class="index" :class="{ 'with-hint': showHint }">
    <ul>
      <li
        v-for="(section, i) in store.getSections"
        :key="i"
        :class="{ selected: section.title === selectedLetter }"
        @click="filterList(section.title)"
        @mouseover="toggleHint"
        @mouseout="toggleHint"
      >
        {{ section.title }}
      </li>
    </ul>

    <div v-if="showHint" class="hint">Click again to reset</div>
  </div>

  <section>
    <dl v-for="(section, i) in store.getSections" :key="i">
      <dt v-if="showSectionTitles">
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
  }

  > ul {
    > li {
      display: inline-block;
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      padding: 2px;
      border-radius: 50%;
      text-transform: uppercase;
      font-weight: var(--font-weight-500);
      font-size: 2rem;
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
      width: var(--letter-block-size);
      height: var(--letter-block-size);
      line-height: var(--letter-block-size);
      margin: 0 0 1.5rem;
      font-size: 22px;
      font-weight: var(--font-weight-500);
      text-transform: uppercase;
      color: var(--white);
      border-radius: 50%;
      background: var(--orange-300);
      text-align: center;
    }

    > dd {
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
  }

  @media screen and (min-width: 640px) {
    column-count: 2;
  }

  @media screen and (min-width: 860px) {
    column-count: 3;
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
