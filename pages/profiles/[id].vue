<template>
    <div>
        <NavBar/>
        <div class="bg-gray-900 text-white min-h-screen">
        <!-- Profile Header -->
        <section class="bg-gradient-to-r from-green-500 to-blue-500 text-center py-20">
            <h1 class="text-4xl font-bold mb-4">User Profile</h1>
            <p class="text-lg text-gray-200 mb-6">Explore user details and activity.</p>
        </section>
    
        <!-- User Details -->
        <section class="p-6">
            <div v-if="users.length === 0" class="text-center text-gray-400">
            Loading user profile...
            </div>
            <div v-else class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <div v-for="user in users" :key="user.UserUID">
                <h2 class="text-[36px] text-2xl font-bold mb-2">{{ user.name }}</h2>
                <p class="text-gray-400 mb-4">{{ user.bio }}</p>
            </div>
            </div>
        </section>
    
        <!-- User Songs -->
        <section class="p-6">
            <h2 class="text-2xl font-bold mb-4">Songs</h2>
            <div v-if="songs.length === 0" class="text-center text-gray-400">
            No songs available for this user.
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
                v-for="song in songs"
                :key="song"
                class="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
                <img :src="song.imageUrl" class="w-[80px] mb-[10px]">
                <h3 class="text-lg font-semibold truncate">{{ song.title }}</h3>
                <p class="text-sm text-gray-400 truncate">{{ song.description }}</p>
                
            </div>
            </div>
        </section>
        </div>
    </div>
  </template>
  
  <script setup>
  import { db } from "@/firebase"
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { collection, query, where, onSnapshot } from "firebase/firestore"
  
  // Reactive variables
  const users = ref([])
  const songs = ref([])
  
  // Get route parameter
  const route = useRoute()
  const id = route.params.id
  
  // Unsubscribe references
  let unsubscribeUser
  let unsubscribeSongs
  
  onMounted(() => {
    // Fetch user data
    const userQuery = query(collection(db, "users"), where("userUID", "==", id))
    unsubscribeUser = onSnapshot(userQuery, (querySnapshot) => {
      users.value = [] // Clear the array before adding new data
      querySnapshot.forEach((doc) => {
        users.value.push(doc.data()) // Add user data to the array
      })
  
      // Fetch songs after user data is loaded
      if (users.value.length > 0) {
        const artistID = users.value[0].userUID
        const songQuery = query(collection(db, "songs"), where("ArtistID", "==", artistID))
        unsubscribeSongs = onSnapshot(songQuery, (querySnapshot) => {
          songs.value = [] // Clear the array before adding new data
          querySnapshot.forEach((doc) => {
            songs.value.push(doc.data()) // Add song data to the array
          })
        })
      }
    })
  })
  
  onUnmounted(() => {
    // Clean up Firestore listeners
    if (unsubscribeUser) unsubscribeUser()
    if (unsubscribeSongs) unsubscribeSongs()
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