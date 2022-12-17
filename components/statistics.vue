<script setup lang="ts">
import { useArtistsStore } from '@/stores/artists'

const store = useArtistsStore();
const lastUpdate = store.lastUpdateAt
const count = store.artists?.length || 0
</script>

<template>
  <div class="details">
    <div v-if="lastUpdate" class="last-update">
      <strong>Last update at {{ lastUpdate }}</strong>.
    </div>

    <div v-if="count" class="total">
      <strong>{{ count }}</strong> artists found.
    </div>


    <div class="credits">
      <a href="https://github.com/sergiocastrovale/discodomeuprimo" target="_blank">Source</a>
    </div>
  </div>
</template>
