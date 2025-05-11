<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isLoading = ref(false)
const authStore = useAuthStore()

const playlists = ref<any[]>([])
const showDropdown = ref<string | null>(null)
const playlistsError = ref('')

// Debounce search
let debounceTimer: any = null
const handleSearchDebounced = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    handleSearch()
  }, 400)
}

onMounted(async () => {
  if (authStore.accessToken) {
    authStore.spotifyApi.setAccessToken(authStore.accessToken)
  } else {
    console.error('Access token is missing. Please log in again.')
  }

  if (authStore.spotifyApi && authStore.isAuthenticated) {
    try {
      const response = await authStore.spotifyApi.getUserPlaylists()
      playlists.value = response.body.items
      playlistsError.value = ''
      console.log('Loaded playlists:', playlists.value)
    } catch (error) {
      playlistsError.value = 'Failed to load playlists. Please re-login or check your permissions.'
      console.error('Error fetching playlists:', error)
    }
  } else {
    playlistsError.value = 'You must be logged in to load playlists.'
    console.warn('Not authenticated or Spotify API not initialized.')
  }
})

const getImageUrl = (item: any) => {
  if (item.album?.images?.[0]) return item.album.images[0].url
  if (item.images?.[0]) return item.images[0].url
  return null
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    if (authStore.spotifyApi) {
      const results = await authStore.spotifyApi.search(searchQuery.value, ['track', 'artist', 'album'], { limit: 20 })
      searchResults.value = [
        ...results.body.tracks?.items || [],
        ...results.body.artists?.items || [],
        ...results.body.albums?.items || []
      ]
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
  }
}

const addToPlaylist = async (playlistId: string, trackUri: string) => {
  if (!trackUri) {
    alert('Invalid track URI.')
    return
  }
  if (!authStore.spotifyApi) {
    alert('Spotify API not initialized. Please log in again.')
    return
  }

  try {
    await authStore.spotifyApi.addTracksToPlaylist(playlistId, [trackUri])
    alert('Track added to playlist!')
    showDropdown.value = null

    const playlist = playlists.value.find(p => p.id === playlistId)
    if (playlist) {
      playlist.tracks.total += 1
    }
  } catch (error: any) {
    let message = 'Failed to add track to playlist.'
    if (error?.body?.error?.message) {
      message += '\n' + error.body.error.message
    }
    alert(message)
    console.error('Add to playlist error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white font-spotify px-4 py-6">
    <!-- Search input -->
    <div class="max-w-xl mx-auto relative mb-8">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search for songs, artists, or albums..."
        class="w-full px-4 py-3 bg-gray-900 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green"
        @input="handleSearchDebounced"
      />
      <span class="material-icons absolute right-4 top-3 text-gray-400">search</span>
    </div>

    <!-- Playlist errors -->
    <div v-if="playlistsError" class="text-center text-red-400 py-2">
      {{ playlistsError }}
    </div>
    <div v-else-if="playlists.length === 0" class="text-center text-yellow-400 py-2">
      No playlists loaded. Try refreshing or check your account permissions.
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>

    <!-- Search results -->
    <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in searchResults"
        :key="item.id"
        class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-colors relative"
      >
        <img
          v-if="getImageUrl(item)"
          :src="getImageUrl(item)"
          alt="Cover"
          class="rounded-md mb-4 w-full h-48 object-cover"
        />
        <div v-else class="h-48 bg-gray-700 rounded-md mb-4"></div>

        <h3 class="text-white font-semibold truncate">{{ item.name }}</h3>
        <p class="text-sm text-gray-400 truncate">
          <span v-if="item.type === 'track' && item.artists">
            {{ item.artists.map(a => a.name).join(', ') }}
          </span>
          <span v-else>
            {{ item.type }}
          </span>
        </p>

        <div class="mt-4 space-y-2">
          <a
            v-if="item.type === 'track'"
            :href="item.external_urls.spotify"
            target="_blank"
            rel="noopener"
            class="text-sm text-spotify-green hover:underline flex items-center"
          >
            <span class="material-icons text-base mr-1">open_in_new</span> Play on Spotify
          </a>

          <div v-if="item.type === 'track'" class="relative">
            <button
              class="bg-spotify-green hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full w-full transition"
              @click="() => showDropdown = showDropdown === item.id ? null : item.id"
            >
              <span class="material-icons align-middle mr-1">playlist_add</span>
              Add to Playlist
            </button>

            <div
              v-if="showDropdown === item.id"
              class="absolute z-20 mt-2 w-full bg-gray-950 border border-gray-700 rounded shadow-lg max-h-48 overflow-y-auto"
            >
              <ul>
                <li
                  v-for="playlist in playlists"
                  :key="playlist.id"
                  class="px-4 py-2 hover:bg-spotify-green hover:text-black cursor-pointer transition-colors"
                  @click="() => addToPlaylist(playlist.id, item.uri)"
                >
                  {{ playlist.name }}
                  <span class="text-xs text-gray-400 ml-2">({{ playlist.tracks.total }} tracks)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-else-if="searchQuery" class="text-center py-8 text-gray-500">
      No results found for "{{ searchQuery }}"
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Material+Icons&display=swap');


</style>



