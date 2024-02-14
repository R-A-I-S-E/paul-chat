// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@nuxtjs/kinde'],
  nitro: {
    preset: 'vercel-edge', // you can use 'vercel' or other providers here
  },
  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    chromadbUrl: process.env.NUXT_CHROMADB_URL,
    chromadbCollectionName: process.env.NUXT_CHROMADB_COLLECTION,
    discordWebhookUrl: process.env.NUXT_DISCORD_WEBHOOK_URL,
  },
  googleFonts: {
    families: {
      'IBM Plex Sans': [400, 500, 600, 700],
      'Archivo Black': [400],
    },
  },
  kinde: {
    authDomain: process.env.NUXT_KINDE_AUTH_DOMAIN,
    clientId: process.env.NUXT_KINDE_CLIENT_ID,
    clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET,
    redirectURL: process.env.NUXT_ENV_VERCEL_URL ? `https://${process.env.NUXT_ENV_VERCEL_URL}/api/callback` : `http://localhost:3000/api/callback`,
    logoutRedirectURL: process.env.NUXT_ENV_VERCEL_URL ? `https://${process.env.NUXT_ENV_VERCEL_URL}` : `http://localhost:3000`,
    postLoginRedirectURL: process.env.NUXT_ENV_VERCEL_URL ? `https://${process.env.NUXT_ENV_VERCEL_URL}` : `http://localhost:3000`,
  },
})
