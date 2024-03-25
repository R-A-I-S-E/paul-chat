// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {

      '30 12 * * *': ['chroma:update'], // runs every day at 12:30
    },

  },
  runtimeConfig: {
    openaiApiKey: '',
    chromadbUrl: '' || 'http://localhost:8000',
    chromadbAuth: '',
    chromadbCollection: 'pluginList',
    discordWebhookUrl: '',
    googleAPIKey: '',
    spreadsheetId: '',
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 500, 600, 700],
      'Archivo Black': 400,
    },
  },

})
