<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { ref } from "vue";
import { doc, setDoc } from "firebase/firestore"; 
import {auth} from "@/firebase"


const songs = ref([]);






const inputText = ref("");

const q = collection(db, "songs");
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  songs.value = [];
  querySnapshot.forEach((doc) => {
    songs.value.push( {
      id: doc.id,
    ...doc.data() });
  });
});


const addtoPlaylist = (songID) => {
  const PlaylistRef = doc(db, 'playlist', auth.currentUser.uid);
  setDoc(PlaylistRef, { 
    OwnerID : auth.currentUser.uid ,
    songs : [songID]
  }, { merge: true });
}
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <!-- Navbar -->

    <NavBar />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-green-500 to-blue-500 text-center py-20">
      <h2 class="text-4xl font-bold mb-4">Welcome to Spotify</h2>
      <p class="text-lg text-gray-200 mb-6">Discover millions of songs and podcasts.</p>
      <button class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
        Get Started
      </button>
      <br>
      <input type="" placeholder="What do you want to play?" 
      v-model = "inputText"
      class="bg-[#1f1f1f] mt-5 w-[600px] h-[40px] rounded mb-[20px] ">
    </section>

    <!-- Content Grid -->
    <section class="p-6">
      <div v-if="songs.length === 0" class="text-center text-gray-400">
        No songs available. Please upload some songs.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div
          v-for="song in songs"
          :key="song.title"
          v-show="song.title.includes(inputText)"
          class="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <img
            :src="song.imageUrl"
            alt="Cover Image"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 class="text-lg font-semibold truncate">
            <NuxtLink :to="{ name: 'songs-id', params: { id: song.id } }">
              
              {{ song.title }}
            </NuxtLink>
          </h3>
          <p class="text-sm text-gray-400 truncate">{{ song.description }}</p>
          <button @click="addtoPlaylist(song.id)">Add to my playlist</button>
        </div>
      </div>
      
    </section>
  </div>
</template>