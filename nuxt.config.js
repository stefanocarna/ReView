export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    port: 8000, // default: 3000
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'review',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@plugins/axios.js', '@plugins/backend.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Do not display the loading bar when navigating among pages
  loading: false,

  // Loader while getting the pages (startup)
  loadingIndicator: {
    name: 'cube-grid',
    color: '#FFF',
    background: '#343837',
  },

  googleFonts: {
    prefetch: true,
    preload: true,
    families: {
      Roboto: true,
      'Patrick+Hand': true,
      Handlee: true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100],
      },
    },
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/google-fonts',
    '@nuxtjs/fontawesome',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  proxy: {
    // '/api/': 'http://127.0.0.1:8001/',
    '/api/': 'https://app-review-backend.herokuapp.com/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
