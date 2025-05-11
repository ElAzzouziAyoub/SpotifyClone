<template>
    <div>
        <NavBar/>
        <div class="bg-gray-900 text-white min-h-screen">
            
            <section class="bg-gradient-to-r from-green-500 to-blue-500 text-center py-20">
                <h1 class="text-4xl font-bold mb-4">Your Playlist</h1>
                <p class="text-lg text-gray-200 mb-6">Manage your favorite songs.</p>
            </section>
        
            
            <section class="p-6">
              <button 
               class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="fetchPlaylist">
                Refresh Playlist
              </button>
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
                    <h3 class="text-lg font-semibold truncate">{{ song?.title }}</h3>
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
  
  
  const songs = ref([])
  
  
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
  
        
        await updateDoc(playlistRef, { songs: updatedSongs })
  
        
        songs.value = songs.value.filter((song) => song.id !== songId)
      } else {
        console.error('Playlist does not exist')
      }
    } catch (error) {
      console.error('Error removing song:', error)
    }
  }
  

  onMounted(() => {
    fetchPlaylist()
  })
  </script>
  
  