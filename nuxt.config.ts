// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      SPOTIFY_CLIENT_ID: 'b14da683ffd84f7e9bc4770798986f3f',
      SPOTIFY_CLIENT_SECRET: '22ae31d4a3b6439d9c4665d5e7d02022',
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss',
    '@nuxtjs/cloudinary'
  ],
  cloudinary: {
    cloudName: 'djygidsqq'
  }
  
})