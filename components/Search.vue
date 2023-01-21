<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();
</script>

<template>
<div class="search">
  <Icon name="ion:search-outline" size="28" />
  <input type="search" placeholder="What are you looking for?" @keyup="store.search" />
  <span>{{ store.count }}</span>
</div>
</template>
