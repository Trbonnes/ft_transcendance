import { Token } from "@nuxtjs/auth-next";

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
  css: [
    '~layouts/global.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/fontawesome'
  ],

  router: {
	  middleware: ['auth']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
	'@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    '@nuxtjs/proxy',
    'nuxt-socket-io',
    'cookie-universal-nuxt'
  ],

  auth: {
    strategies: {
    local: {
      cookie: {
        options: {
          expires: new Date(new Date().getTime()+20000000000).getTime(), //thats today + a year
          maxAge: 31622400
        }
      },
      token: {
        property: '',
        required: true,
        type: "Bearer",
      },
      endpoints: {
        login: { url: '/auth/log-in', method: 'post' },
        logout: { url: '/auth/log-out', method: 'post' },
        user: false
        //user: {url: '/auth/user', method: 'post', prepertyName: ''},
      },
      redirect: {
        login: '/login',
        logout: '/login',
        callback: '/login',
        home: '/',
      }
    }
  }
  },

  fontawesome : {
    icons: {
      solid: true
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:3000',
    //credentials: true
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
