import { createStore } from 'vuex'

export default createStore({
  state: {
    tracks: [],
  },
  mutations: {
    setTracks(state, tracks) {
      state.tracks = tracks
    },
  },
  actions: {
    async fetchTracks({ commit }) {
      try {
        const token = await this.$axios.$post('https://accounts.spotify.com/api/token', new URLSearchParams({ grant_type: 'client_credentials' }), {
          headers: {
            Authorization: `Basic ${btoa('YOUR_CLIENT_ID:YOUR_CLIENT_SECRET')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        
        const res = await this.$axios.$get('https://api.spotify.com/v1/playlists/YOUR_PLAYLIST_ID/tracks', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        
        commit('setTracks', res.items)
      } catch (err) {
        console.error('Error fetching tracks:', err)
      }
    },
  },
  getters: {
    allTracks: (state) => state.tracks,
  },
})