<script setup lang="ts">
import { LocalCatalogue } from "../entities/localCatalogue";

const { catalogue } = defineProps<{
  catalogue: LocalCatalogue | undefined
}>();

let selectedFormat = $ref<string>();

onMounted(() => {
  toggleFormat([...formats].shift() || '');
});

const formats = $computed(() =>
  catalogue
    ? Object.keys(catalogue).sort((a: string, b: string): number => a.toLocaleLowerCase() < b.toLocaleLowerCase() ? -1 : 1)
    : []
);

function toggleFormat(format: string) {
  selectedFormat = format;
}
</script>

<template>
<div class="catalogue">
  <h2>Local catalogue</h2>

  <template v-if="catalogue">
    <ul class="types">
      <li v-for="format in formats" :key="format" :class="{ 'active': selectedFormat === format }" @click="toggleFormat(format)">
        {{ format }}
      </li>
    </ul>

    <div v-for="format in formats" :key="format" class="catalogue-format" :class="{ 'active': selectedFormat === format }">
      <h3>{{ format }} ({{ catalogue[format].length }})</h3>

      <div v-for="(release, i) in catalogue[format]" :key="i" class="release">
        <strong>{{ release.title }}</strong>
      </div>
    </div>
  </template>
</div>
</template>
