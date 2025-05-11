<template>
    <NavBar/>
    <div class="bg-gray-900 text-white min-h-screen">
      <div v-if="!song" class="text-center text-gray-400">Loading...</div>
      <div v-else class="p-6">
        <div class="text-[36px]">Artist : {{song.ArtistName}}</div>
        <button class="text-green-300"><NuxtLink :to="`/profiles/${song.ArtistID}`">Check profile</NuxtLink></button>
        <h1 class="text-4xl font-bold mb-4">{{ song.title }}</h1>
        <p class="text-lg text-gray-400 mb-6">{{ song.description }}</p>
        <img :src="song.imageUrl" alt="Cover Image" class="m-[auto] h-64 object-cover rounded-lg mb-4" />
        <audio
        controls
        class="fixed bottom-0 left-0 w-full 
        bg-[#181818] text-white p-4 shadow-lg"
        >
        <source :src="song.audioUrl" type="audio/mpeg" />
        Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  </template>
  
  <script setup>
  import { db } from '@/firebase'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { doc, getDoc } from 'firebase/firestore'
  
  const songId = useRoute().params.id
  

  const song = ref(null)
  
  
  onMounted(async () => {
    try {
      const docRef = doc(db, 'songs', songId)
      const docSnap = await getDoc(docRef) 
  
      if (docSnap.exists()) {
        song.value = docSnap.data() 
      } else {
        console.error('No such document!')
      }
    } catch (error) {
      console.error('Error fetching song:', error)
    }
  })
  </script>