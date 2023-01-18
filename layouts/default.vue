<script lang="ts" setup>
const route = useRoute()
const withHeader = computed(() => route.meta.withHeader ?? false)
</script>

<template>
  <header v-if="withHeader">
    <search />

    <statistics />
  </header>
  <slot />
</template>
