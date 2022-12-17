<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();
</script>

<template>
<div class="search">
  <span></span>
  <input type="search" placeholder="Search here" @keyup="store.search" />
</div>
</template>
