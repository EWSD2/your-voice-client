<template>
  <v-app dark style="background: #1181b2">
    <v-main>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      color="primary"
      dark
      app
    >
      <v-col
        cols="12"
        class="text-center secondary--text"
      >
        <strong>Your Voice Magazine</strong>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false,
      title: 'Your Voice Magazine'
    }
  },
  computed: {
    sideNavItems () {
      const items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      return items
    },

    horizontalNavItems () {
      const items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      return items
    }
  }
}
</script>
