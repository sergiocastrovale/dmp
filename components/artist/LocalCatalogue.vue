<script setup lang="ts">
import { LocalCatalogue } from '../../entities/localCatalogue';

const props = defineProps<{
  catalogue: LocalCatalogue | undefined;
}>();

let selectedFormat = $ref<string>();

onMounted(() => {
  toggleFormat([...formats].shift() || '');
});

const formats = $computed(() =>
  props.catalogue
    ? Object.keys(props.catalogue).sort((a: string, b: string): number =>
        a.toLocaleLowerCase() < b.toLocaleLowerCase() ? -1 : 1,
      )
    : [],
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
        <li
          v-for="format in formats"
          :key="format"
          :class="{ active: selectedFormat === format }"
          @click="toggleFormat(format)"
        >
          {{ format }} ({{ catalogue[format].length }})
        </li>
      </ul>

      <div
        v-for="format in formats"
        :key="format"
        class="catalogue-format"
        :class="{ active: selectedFormat === format }"
      >
        <div v-for="(release, i) in catalogue[format]" :key="i" class="release">
          <strong>{{ release.title }}</strong>
        </div>
      </div>
    </template>
  </div>
</template>
