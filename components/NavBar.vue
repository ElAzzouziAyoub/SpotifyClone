<template>
  <div class="bg-black h-[80px] w-full flex justify-between text-white">
    <div class="text-white">
      <NuxtLink to="/HomePage">
        <img src="/spotify.png" class="w-[50px] h-[50px] ml-5 mt-4">
      </NuxtLink>
    </div>

    <div>
      <input type="" placeholder="What do you want to play?" class="bg-[#1f1f1f] mt-5 w-[600px] h-[40px] rounded ">
    </div>
    <div class="flex justify-between w-[800px]">
      <button @click="navigateTo('/PostSong')">
        Post
      </button>
      <button v-if="id">
        <NuxtLink :to="`/profiles/${id}`">Profile</NuxtLink>
      </button>
      <button v-else>
        <NuxtLink to="/login">Login</NuxtLink>
      </button>
      <button>
        <NuxtLink to="/Artists">Artists</NuxtLink>
      </button>
      <button>
        <NuxtLink to="/playlist">Playlist</NuxtLink>
      </button>
      <button>
        Sign up
      </button>
      <div>
        <button class="bg-white rounded p-5 text-black h-[30px] w-[180px]  font-bold mt-6 flex items-center justify-center ml-10" >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const id = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      id.value = user.uid // Set the user ID when authenticated
    } else {
      id.value = null // Clear the ID when not authenticated
    }
  })
})
</script>