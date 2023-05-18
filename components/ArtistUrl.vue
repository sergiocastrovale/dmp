<script setup lang="ts">
const props = defineProps<{
  item: any;
}>();

const icon = $computed(() => {
  const urls = [
    { name: 'Spotify', icon: 'tabler:brand-spotify', size: '20' },
    { name: 'Last.fm', icon: 'tabler:brand-lastfm', size: '22' },
    { name: 'Deezer', icon: 'jam:deezer-circle', size: '19' },
    { name: 'iTunes', icon: 'simple-icons:itunes', size: '19' },
    { name: 'Youtube', icon: 'ant-design:youtube-outlined', size: '22' },
    { name: 'Amazon Music', icon: 'ph:amazon-logo', size: '22' },
  ];

  const found = urls.find((u) => u.name === props.item.name);

  if (!found) {
    return {
      name: 'Unknown',
      icon: 'fluent:presence-unknown-20-regular',
      size: '22',
    };
  }

  return found;
});
</script>

<template>
  <NuxtLink :to="item.url" target="_blank" class="artist-url">
    <Icon :name="icon.icon" :size="icon.size" /> {{ item.name }}
  </NuxtLink>
</template>
