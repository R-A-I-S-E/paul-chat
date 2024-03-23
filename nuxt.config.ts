// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    chromadbUrl: process.env.NUXT_CHROMADB_URL || 'http://localhost:8000',
    chromadbAuth: process.env.NUXT_CHROMADB_AUTH,
    chromadbCollectionName: process.env.NUXT_CHROMADB_COLLECTION || 'pluginList',
    discordWebhookUrl: process.env.NUXT_DISCORD_WEBHOOK_URL,
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 500, 600, 700],
      'Archivo Black': [400],
    },
  },

})
