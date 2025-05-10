export default {
  head: {
    title: 'Spotify Homepage',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A homepage that fetches and displays songs from the Spotify API.' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' }
    ]
  },
  css: [
    '@/assets/styles/main.css'
  ],
  plugins: [
    '@/plugins/axios.js'
  ],
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  axios: {
    baseURL: 'https://api.spotify.com/v1'
  },
  pwa: {
    manifest: {
      name: 'Spotify Homepage',
      short_name: 'Spotify',
      lang: 'en',
      display: 'standalone',
      theme_color: '#1DB954',
      background_color: '#121212'
    }
  }
}