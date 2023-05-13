<script setup lang="ts">
import { Catalogue } from '~/entities/catalogue';
import { Release } from '~/entities/release';

const props = defineProps<{
  catalogue?: Catalogue[];
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

function parseYear(release: Release) {
  let year = '';

  if (release['first-release-date']) {
    year = new Date(release['first-release-date']).getFullYear().toString();

    return `${year} - `;
  }
}
</script>

<template>
  <div v-if="catalogue" class="catalogue">
    <h2>Official catalogue</h2>

    <ul class="types">
      <li
        v-for="format in formats"
        :key="format"
        :class="{ active: selectedFormat === format }"
        @click="toggleFormat(format)"
      >
        {{ format }}
      </li>
    </ul>

    <div
      v-for="format in formats"
      :key="format"
      class="catalogue-format"
      :class="{ active: selectedFormat === format }"
    >
      <h3>{{ format }} ({{ catalogue[format].length }})</h3>

      <NuxtLink
        v-for="(release, i) in catalogue[format]"
        :key="i"
        class="release"
        :to="`https://musicbrainz.org/release-group/${release.id}`"
      >
        <strong> {{ parseYear(release) }}{{ release.title }} </strong>
        <div class="more">
          <ul
            v-if="release['secondary-types']?.length"
            class="secondary-formats"
          >
            <li
              v-for="secondaryFormat in release['secondary-types']"
              :key="secondaryFormat"
            >
              {{ secondaryFormat }}
            </li>
          </ul>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
