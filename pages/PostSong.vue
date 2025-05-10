<script setup>
import { ref } from 'vue'
import { setDoc, doc } from 'firebase/firestore'
import { db } from '~/firebase'
import { useRouter } from 'vue-router'
import { auth} from '@/firebase'

const title = ref('')
const description = ref('')
const imageFile = ref(null)
const audioFile = ref(null)
const router = useRouter()

const handleImageUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const handleAudioUpload = (event) => {
  audioFile.value = event.target.files[0]
}

const uploadToCloudinary = async (file, folder = 'songs') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'nuxt-cloudinary-unsigned') // Replace with your upload preset
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/djygidsqq/${file.type.startsWith('audio') ? 'video' : 'image'}/upload`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  return data.secure_url
}

const handleSubmit = async () => {
  if (!imageFile.value || !audioFile.value || !title.value) {
    alert("Please fill in all required fields.")
    return
  }

  try {
    // Upload files to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile.value, 'covers')
    const audioUrl = await uploadToCloudinary(audioFile.value, 'tracks')

    // Log the uploaded data
    console.log("Uploaded:", { title: title.value, description: description.value, imageUrl, audioUrl })

    // Save to Firebase (optional)
    await setDoc(doc(db, 'songs', `${title.value}${auth.currentUser.uid}`), {
      id : `${title.value}${auth.currentUser.uid}`,
      title: title.value,
      description: description.value,
      imageUrl,
      audioUrl,
      ArtistName : auth.currentUser.displayName,
      ArtistID : auth.currentUser.uid

    })

    await setDoc(doc(db, 'artists', auth.currentUser.uid), {
      name : auth.currentUser.displayName,
      //push the new song ID to the artist's songs array, the song
      songs : [`${title.value}${auth.currentUser.uid}`] },
      { merge: true })

    alert("Song uploaded successfully!")
    router.push('/HomePage') // Navigate back to the homepage
  } catch (error) {
    console.error("Error uploading song:", error)
    alert("Failed to upload song. Please try again.")
  }
}
</script>

<template>
  <div>
    <NavBar/>
    <div class="bg-black h-screen">
      <div class="bg-[#121212] w-[1000px] text-white h-[600px] m-auto rounded flex flex-col justify-center">
        <div class="m-auto">
          <img src="/spotify.png" alt="" class="w-[50px]" />
        </div>
        <div class="m-auto">
          <h1 class="text-[45px]">Post your own songs</h1>
        </div>
        <div class="m-auto">
          <div class="m-auto">
            <label for="">Title</label> <br />
            <input type="text" name="" id="" class="bg-[#1f1f1f] text-white w-[350px] rounded h-[40px]" v-model="title" /> <br />
          </div>

          <div class="m-auto">
            <label for="">Description</label> <br />
            <textarea name="" id="" class="bg-[#1f1f1f] text-white w-[450px] rounded h-[60px]" v-model="description"></textarea> <br />
          </div>
          <div class="m-auto">
            <label for="cover">Cover Image</label> <br />
            <input type="file" id="cover" @change="handleImageUpload" accept="image/*" class="text-white" />
          </div>

          <div class="m-auto mt-4">
            <label for="song">MP3 File</label> <br />
            <input type="file" id="song" @change="handleAudioUpload" accept="audio/mpeg" class="text-white" />
          </div>
        </div>
        <div class="flex gap-[10px] m-auto">
          <button @click="router.push('/HomePage')" class="bg-[#1ed760] text-white text-center w-[60px] h-[40px] font-bold rounded">Return</button>
          <button @click="handleSubmit" class="bg-[#1ed760] text-white text-center w-[60px] h-[40px] font-bold rounded">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>