<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      color="secondary"
      dark
      temporary
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="item.link"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      color="primary"
      dense
      dark
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link
        to="/"
        tag="span"
        style="cursor: pointer"
      >
        <v-toolbar-title class="secondary--text hidden-xs-only" v-text="title" />
      </router-link>
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
          color="primary"
          depressed
        >
          <v-icon
            class="hidden-sm-only"
            left
          >
            {{ item.icon }}
          </v-icon>
          {{ item.title }}
        </v-btn>
        <!-- Signout Button -->
        <v-btn
          v-if="isAuthenticated"
          depressed
          color="primary"
          @click="handleSignoutUser"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >
            mdi-exit-to-app
          </v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
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
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      drawer: false,
      title: 'Your Voice Magazine'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole']),
    sideNavItems () {
      const items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      if (this.isAuthenticated) {}

      return items
    },

    horizontalNavItems () {
      const items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      return items
    }
  },

  methods: {
    handleSignoutUser () {
      this.$apolloHelpers.onLogout()
      this.$store.commit('setsetIsAuthenticated', false)
      this.$router.go()
    }
  }
}
</script>
