<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const artists = ref([]);

const inputText = ref("");
const q = collection(db, "artists");

let unsubscribe;

onMounted(() => {
  
  unsubscribe = onSnapshot(q, (querySnapshot) => {
    artists.value = []; 
    querySnapshot.forEach((doc) => {
      artists.value.push({
        id: doc.id,
        ...doc.data()
      });
    });
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <div class="bg-gray-900 text-white min-h-screen">
    
    <NavBar />

    
    <section class="bg-gradient-to-r from-green-500 to-blue-500 text-center py-20">
      <h2 class="text-4xl font-bold mb-4">Discover Artists</h2>
      <p class="text-lg text-gray-200 mb-6">Explore your favorite artists and their music.</p>
      <input
        type="text"
        placeholder="Search for an artist..."
        v-model="inputText"
        class="bg-[#1f1f1f] text-white w-[600px] h-[40px] rounded px-4"
      />
    </section>

    
    <section class="p-6">
      <div v-if="artists.length === 0" class="text-center text-gray-400">
        No artists available.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="artist in artists"
          :key="artist.id"
          v-show="artist.name.toLowerCase().includes(inputText.toLowerCase())"
          class="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <img
            v-if="artist.imageUrl"
            :src="artist.imageUrl"
            alt="Artist Image"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 class="text-lg font-semibold truncate">
            <NuxtLink :to="`/profiles/${artist.id}`"> {{ artist.name }}</NuxtLink>
          </h3>
          <p class="text-sm text-gray-400 truncate">{{ artist.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>