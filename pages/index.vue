<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <img src="/spotify.png" alt="" class="w-[45px]">
      <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

    
      <input v-model="email" type="email" placeholder="Email" class="bg-[#1f1f1f] text-white"/>
      <input v-model="password" type="password" placeholder="Mot de passe" class="bg-[#1f1f1f] text-white"/>

      
      <template v-if="!isLogin">
        <input v-model="firstName" type="text" placeholder="Prénom" class="bg-[#1f1f1f] text-white"/>
        <input v-model="lastName" type="text" placeholder="Nom" class="bg-[#1f1f1f] text-white"/>
        <div class="m-auto">
          <label for="cover">Cover Image</label> <br />
          <input type="file" id="cover" @change="handleImageUpload" accept="image/*" class="text-white" />
        </div>
      </template>

      

      <button @click="handleSubmit" class="submit-btn">
        {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
      </button>

      <p @click="toggleForm" class="toggle-form">
        {{ isLogin ? 'Pas encore inscrit ? Créez un compte' : 'Déjà un compte ? Connectez-vous' }}
      </p>
    </div>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-8">Welcome to Spotify Clone</h1>
      <div v-if="authStore.isAuthenticated">
        <p class="mb-4">Logged in as: <strong>{{ authStore.user?.display_name }}</strong></p>
        <img v-if="authStore.user?.images?.[0]?.url" :src="authStore.user.images[0].url" alt="Profile" class="mx-auto rounded-full w-24 h-24 mb-4" />
        <button @click="logout" class="btn-spotify">Logout</button>
      </div>
      <div v-else>
        <button
          @click="logina"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
        >
          Login with Spotify
        </button>
      </div>
    </div>
  </div>

    
  </div>
</template>


<script setup> 
import { ref } from 'vue'
import { login, signup } from '@/services/authService'
import { updateProfile } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { setDoc , doc } from 'firebase/firestore'
import { db } from '@/firebase'
import {auth} from '@/firebase'

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const isLogin = ref(true)
const router = useRouter()
const imageFile = ref(null)


onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (!user) {
      router.push('/')
    }
  })

  return () => unsubscribe()
})

const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const uploadToCloudinary = async (file, folder = 'profile_images') => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'nuxt-cloudinary-unsigned') // Replace with your upload preset
      formData.append('folder', folder)

      const res = await fetch('https://api.cloudinary.com/v1_1/djygidsqq/image/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to upload image')
      }

      return data.secure_url
    }

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      // Login with email and password
      await login(email.value, password.value)
    } else {
      // Sign up with email, password, first name, and last name
      const userCredential = await signup(email.value, password.value)
      // Update profile with full name
      await updateProfile(userCredential.user, {
        displayName: `${firstName.value} ${lastName.value}`
      })


      const imageUrl = await uploadToCloudinary(imageFile.value, 'covers')
      

      
      await setDoc(doc(db, "users", auth.currentUser.uid),
      {
        name: `${firstName.value} ${lastName.value}`,
        first_name : `${firstName.value}`,
        userUID : auth.currentUser.uid,
        imageUrl 
 
      });

    }
    
    router.push('/HomePage')
  } catch (err) {
    alert(err.message)
  }
}

const toggleForm = () => {
  isLogin.value = !isLogin.value
  // Reset additional fields when toggling
  firstName.value = ''
  lastName.value = ''
}


const config = useRuntimeConfig()
const authStore = useAuthStore()

const logina = () => {
  const scope = [
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'streaming'
  ].join(' ')

  const params = new URLSearchParams({
    client_id: config.public.spotifyClientId,
    response_type: 'code',
    redirect_uri: config.public.spotifyRedirectUri,
    scope
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

const logout = () => {
  authStore.logout()
  window.location.reload()
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #272b2e, #000000);
  padding: 1rem;
}

.auth-card {
  background-color: #000000;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.5s ease;
}

.auth-card h2 {
  text-align: center;
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
}

.auth-card input {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.auth-card input:focus {
  outline: none;
  border-color: #1ed760;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #1ed760;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #1dc056;
}

.toggle-form {
  text-align: center;
  font-size: 0.95rem;
  color: #1ed760;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-form:hover {
  color: #1ec157;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }

  .auth-card h2 {
    font-size: 1.6rem;
  }

  .submit-btn {
    font-size: 1rem;
  }
}

/* Fade-in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>