<template>
    <div>
        <NavBar/>
        <div class="bg-gray-900 text-white min-h-screen">
            <!-- Header -->
            <section class="bg-gradient-to-r from-green-500 to-blue-500 text-center py-20">
                <h1 class="text-4xl font-bold mb-4">Your Playlist</h1>
                <p class="text-lg text-gray-200 mb-6">Manage your favorite songs.</p>
            </section>
        
            <!-- Playlist Songs -->
            <section class="p-6">
                <div v-if="songs.length === 0" class="text-center text-gray-400">
                Your playlist is empty.
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div
                    v-for="song in songs"
                    :key="song.id"
                    class="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                    <img
                    :src="song.imageUrl"
                    alt="Song Cover"
                    class="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 class="text-lg font-semibold truncate">{{ song.title }}</h3>
                    <p class="text-sm text-gray-400 truncate">{{ song.description }}</p>
                    <audio controls class="w-full mt-4 rounded-lg">
                    <source :src="song.audioUrl" type="audio/mpeg" />
                    Your browser does not support the audio element.
                    </audio>
                    <button
                    @click="removeSong(song.id)"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600"
                    >
                    Remove
                    </button>
                </div>
                </div>
            </section>
            </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { db } from '@/firebase'
  import { doc, getDoc, updateDoc } from 'firebase/firestore'
  import { auth } from '@/firebase'
  
  // Reactive variables
  const songs = ref([])
  
  // Fetch the user's playlist
  const fetchPlaylist = async () => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) {
        console.error('User not authenticated')
        return
      }
  
      const playlistRef = doc(db, 'playlist', userId)
      const playlistSnap = await getDoc(playlistRef)
  
      if (playlistSnap.exists()) {
        const playlistData = playlistSnap.data()
        const songIds = playlistData.songs || []
  
        // Fetch song details for each song ID
        const songPromises = songIds.map(async (songId) => {
          const songRef = doc(db, 'songs', songId)
          const songSnap = await getDoc(songRef)
          if (songSnap.exists()) {
            return { id: songId, ...songSnap.data() }
          }
          return null
        })
  
        const fetchedSongs = await Promise.all(songPromises)
        songs.value = fetchedSongs.filter((song) => song !== null) // Filter out null values
      } else {
        console.error('Playlist does not exist')
      }
    } catch (error) {
      console.error('Error fetching playlist:', error)
    }
  }
  
  // Remove a song from the playlist
  const removeSong = async (songId) => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) {
        console.error('User not authenticated')
        return
      }
  
      const playlistRef = doc(db, 'playlist', userId)
      const playlistSnap = await getDoc(playlistRef)
  
      if (playlistSnap.exists()) {
        const playlistData = playlistSnap.data()
        const updatedSongs = playlistData.songs.filter((id) => id !== songId)
  
        // Update the playlist in Firestore
        await updateDoc(playlistRef, { songs: updatedSongs })
  
        // Update the local songs array
        songs.value = songs.value.filter((song) => song.id !== songId)
      } else {
        console.error('Playlist does not exist')
      }
    } catch (error) {
      console.error('Error removing song:', error)
    }
  }
  
  // Fetch the playlist when the component is mounted
  onMounted(() => {
    fetchPlaylist()
  })
  </script>
  
  <style>
  /* Add Spotify-like styling */
  body {
    font-family: 'Arial', sans-serif;
  }
  
  .bg-gradient-to-r {
    background: linear-gradient(to right, #1db954, #1ed760);
  }
  
  .text-white {
    color: #fff;
  }
  
  .text-gray-400 {
    color: #b3b3b3;
  }
  
  .bg-gray-900 {
    background-color: #121212;
  }
  
  .bg-gray-800 {
    background-color: #181818;
  }
  
  .shadow-lg {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .text-center {
    text-align: center;
  }
  
  .font-bold {
    font-weight: bold;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  
  .gap-6 {
    gap: 1.5rem;
  }
  </style>