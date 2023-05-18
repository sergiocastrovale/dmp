<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists';

const store = useArtistsStore();
</script>

<template>
  <div class="search">
    <Icon name="ion:search-outline" size="32" />
    <input
      v-model="store.query"
      type="search"
      placeholder="Search for..."
      @keyup="store.search"
    />
  </div>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  background: var(--white);
  border-bottom: 4px solid var(--grey-300);
  color: var(--grey-200);
  font-size: 1rem;

  > svg {
    margin: 0 1.25rem;
  }

  > input[type='search'] {
    flex: 1;
    padding: 0;
    font-weight: var(--font-weight-300);
    font-family: var(--font-family);
    font-size: 3rem;
    line-height: 7rem;
    color: var(--grey-200);
    border: none;

    &::-webkit-search-cancel-button {
      -webkit-appearance: none;
      opacity: 0;
    }

    &::placeholder {
      color: var(--grey-200);
      font-weight: var(--font-weight-300);
      font-family: var(--font-family);
    }

    &:focus,
    &:focus-visible {
      outline: none;
    }
  }
}
</style>
