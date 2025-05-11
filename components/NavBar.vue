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
      <button 
      active-class="text-green-600 font-semibold"
      @click="navigateTo('/PostSong')">
        Post
      </button>
      <button>
        <NuxtLink 
        active-class="text-green-600 font-semibold"
        :to="`/search`">Search</NuxtLink>
      </button>
      <button>
        <NuxtLink 
        active-class="text-green-600 font-semibold"
        :to="`/profiles/${id}`">Profile</NuxtLink>
      </button>

      <button>
        <NuxtLink 
        active-class="text-green-600 font-semibold"
        to="/Artists">Artists</NuxtLink>
      </button>
      <button>
        <NuxtLink 
        active-class="text-green-600 font-semibold"
        to="/playlist">Playlist</NuxtLink>
      </button>
      <div>
        <button 
        @click = "signOut_"
        active-class="text-green-600 font-semibold"
        class="bg-white rounded p-5 text-black h-[30px] w-[180px]  font-bold mt-6 flex items-center justify-center ml-10" >
          Sign out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged , signOut } from 'firebase/auth'
import {useRouter} from 'vue-router'

const id = ref(null)
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      id.value = user.uid
    } else {
      useRouter().push("/")
    }
  })
})

const signOut_ = async () => {
  try {
    await signOut(auth)
    id.value = null;
    router.push('/');
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>