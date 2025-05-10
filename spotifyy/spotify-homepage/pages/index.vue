<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import TrackCard from '~/components/TrackCard.vue'

const store = useStore()
const tracks = ref([])

onMounted(async () => {
  await store.dispatch('fetchTracks')
  tracks.value = store.state.tracks
})
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-white mb-4">Spotify Tracks</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <TrackCard v-for="(track, index) in tracks" :key="index" :track="track" />
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #121212;
}
</style>