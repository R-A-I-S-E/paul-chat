// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {

      '* * * * *': ['chroma:update'],
    },

  },
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    chromadbUrl: process.env.NUXT_CHROMADB_URL || 'http://localhost:8000',
    chromadbAuth: process.env.NUXT_CHROMADB_AUTH || process.env.CHROMA_SERVER_AUTH_CREDENTIALS,
    chromadbCollectionName: process.env.NUXT_CHROMADB_COLLECTION || 'pluginList',
    discordWebhookUrl: process.env.NUXT_DISCORD_WEBHOOK_URL,
    googleAPIKey: process.env.NUXT_GOOGLE_API_KEY,
    spreadsheetId: process.env.NUXT_SPREADSHEET_ID,
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 500, 600, 700],
      'Archivo Black': 400,
    },
  },

})
