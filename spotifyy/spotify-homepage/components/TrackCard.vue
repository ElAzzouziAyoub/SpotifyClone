<template>
  <div class="track-card bg-black text-white rounded p-4">
    <img :src="track.album.images[0].url" class="album-cover w-full rounded mb-2" alt="Album Cover" />
    <h2 class="track-name text-lg font-bold">{{ track.name }}</h2>
    <p class="artist-name text-sm text-gray-400">{{ track.artists[0].name }}</p>
  </div>
</template>

<script setup>
defineProps({
  track: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.track-card {
  transition: transform 0.2s;
}

.track-card:hover {
  transform: scale(1.05);
}

.album-cover {
  height: auto;
}

.track-name {
  margin-top: 0.5rem;
}

.artist-name {
  margin-top: 0.25rem;
}
</style>