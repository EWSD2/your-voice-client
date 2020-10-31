export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  ssr: true,
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s -Your Voice Magazine',
    title: 'your-voice-client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vuetify.js',
    { src: '~/plugins/vue-plotly.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/firebase'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    credentials: false
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#212221',
          accent: '#44449b',
          secondary: '#1181b2',
          info: '#00bcd4',
          warning: '#ff5722',
          error: '#f32516',
          success: '#8bc34a'
        }
      }
    }
  },

  // Loading indicator configuration
  loading: {
    color: '#44449b',
    height: '5px',
    continuous: true
  },

  // Apollo config
  apollo: {
    clientConfigs: {
      default: '~/apollo/apollo-config.js'
    }
  },

  // Firebase config
  firebase: {
    config: {
      apiKey: 'AIzaSyByz_LxQsq7IycuyVxSlJ81fMM-iahZSeQ',
      authDomain: 'ewsd-your-voice.firebaseapp.com',
      databaseURL: 'https://ewsd-your-voice.firebaseio.com',
      projectId: 'ewsd-your-voice',
      storageBucket: 'ewsd-your-voice.appspot.com',
      messagingSenderId: '760392566777',
      appId: '1:760392566777:web:9217aeff237e102b26df28',
      measurementId: 'G-HMVF0K7C1P'
    },
    services: {
      storage: true
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  // Install global router middleware
  router: {
    middleware: ['checkAuth']
  }
}
