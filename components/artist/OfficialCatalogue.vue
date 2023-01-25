<script setup lang="ts">
import { Catalogue } from '~/entities/catalogue';

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
        <strong>{{ release.title }}</strong>
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

          <span class="release-date">
            Released in {{ release['first-release-date'] }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
