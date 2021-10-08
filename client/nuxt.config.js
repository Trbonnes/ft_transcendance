import { RefreshController, Token } from '@nuxtjs/auth-next'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  target: 'static',
  mode: 'spa',
  loading: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ft_transcendance',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~layouts/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/axios-accessor'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome',
  ],

  router: {
    middleware: ['init-chat-socket']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/toast',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    'nuxt-socket-io',
    'cookie-universal-nuxt',
  ],

  auth: {
    localStorage: false,
    strategies: {
      fortytwo: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://api.intra.42.fr/oauth/authorize',
        },
        grantType: 'authorization_code',
        responseType: 'code',
        redirectUri: process.env.FT_OAUTH_REDIRECT_URI,
        clientId: process.env.FT_OAUTH_UID,
        state: 'askdfj1239eo1234098rhj5fgoej',
      },
      localrefresh: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer',
          maxAge: 10800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 7,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: 'auth/login', method: 'post' },
          logout: false,
          user: { url: 'auth/user', method: 'get' },
          refresh: { url: 'auth/refresh', method: 'post' },
        },
      },
      testrefresh: {
        redirect : {
          home : false
        },
        scheme: 'refresh',
        token: {
          property: 'access_token',
          required: true,
          type: 'Bearer',
          maxAge: 10800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 7,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: 'auth/testuser', method: 'post' },
          logout: false,
          user: { url: 'auth/user', method: 'get' },
          refresh: { url: 'auth/refresh', method: 'post' },
        },
      },
    },
  },

  toast: {
    position: 'bottom-right',
    duration: '5000',
  },

  fontawesome: {
    icons: {
      solid: true,
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:3000',
  },

  // proxy: {
  //   '/api/': {target: 'http:localhost:3000', pathRewrite: {'^/api/': ''}, changeOrigin: true },
  // },

  // io: {
  //   sockets: [
  //     {
  //       name: 'default',
  //       url: 'http://localhost:3000',
  //       default: true,
  //       vuex: {},
  //       namespaces: {},
  //     },
  //   ]
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
