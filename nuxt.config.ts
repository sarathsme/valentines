// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    output: {
      publicDir: 'docs'
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
