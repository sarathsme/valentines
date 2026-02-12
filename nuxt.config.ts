// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/valentines/'
  },
  nitro: {
    output: {
      publicDir: 'docs'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
