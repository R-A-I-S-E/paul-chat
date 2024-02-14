// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', ],
  nitro: {
    preset: 'vercel-edge', // you can use 'vercel' or other providers here
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    chromadbUrl: process.env.CHROMADB_URL,
    chromadbCollectionName: process.env.CHROMADB_COLLECTION,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 500, 600, 700],
      'Archivo Black': [400],
    },
  },
})
