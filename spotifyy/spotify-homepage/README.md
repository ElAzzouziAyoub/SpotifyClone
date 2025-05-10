# Spotify Homepage

This is a Nuxt.js project that fetches songs from the Spotify API and displays them in a visually appealing layout that matches the Spotify design aesthetic.

## Project Structure

```
spotify-homepage
├── assets
│   └── styles
│       └── main.css        # Global CSS styles for the application
├── components
│   └── TrackCard.vue       # Component for displaying individual track information
├── layouts
│   └── default.vue         # Default layout for the application
├── pages
│   └── index.vue           # Main entry point for the homepage
├── plugins
│   └── axios.js            # Axios configuration for API requests
├── store
│   └── index.js            # Vuex store for managing application state
├── nuxt.config.js          # Nuxt.js configuration file
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd spotify-homepage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a Spotify Developer Account:**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and create an account if you don't have one.
   - Create a new application to get your `CLIENT_ID` and `CLIENT_SECRET`.

4. **Configure your credentials:**
   - Update the `plugins/axios.js` file with your Spotify `CLIENT_ID` and `CLIENT_SECRET`.

5. **Run the application:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- The homepage will display a list of tracks fetched from your specified Spotify playlist.
- Each track is represented by a card that includes the album cover, track name, and artist name.
- The design is responsive and should look good on both desktop and mobile devices.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.