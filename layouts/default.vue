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
      let items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      if (this.isAuthenticated && this.userRole === 'ADMIN') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-calendar-range', title: 'List Academic Years', link: '/years' },
          { icon: 'mdi-calendar-edit', title: 'Create Academic Year', link: '/years/add' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'GUEST') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-file-chart', title: 'View Reports', link: '/reports' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'MANAGER') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-view-grid-plus', title: 'View Selections', link: '/selections' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'COORDINATOR') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-view-grid-plus', title: 'View Selections', link: '/selections' },
          { icon: 'mdi-format-list-text', title: 'View Submissions', link: '/submissions' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'STUDENT') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-format-list-text', title: 'View Submissions', link: '/submissions' },
          { icon: 'mdi-typewriter', title: 'Add Submissions', link: '/submissions/add' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'DEV') {
        items = [
          { icon: 'mdi-apps', title: 'Home', link: '/' },
          { icon: 'mdi-calendar-range', title: 'List Academic Years', link: '/years' },
          { icon: 'mdi-calendar-edit', title: 'Create Academic Year', link: '/years/add' },
          { icon: 'mdi-file-chart', title: 'View Reports', link: '/reports' },
          { icon: 'mdi-view-grid-plus', title: 'View Selections', link: '/selections' },
          { icon: 'mdi-format-list-text', title: 'View Submissions', link: '/submissions' },
          { icon: 'mdi-typewriter', title: 'Add Submissions', link: '/submissions/add' }
        ]
      }

      return items
    },

    horizontalNavItems () {
      let items = [
        // { icon: 'mdi-apps', title: 'Home', to: '/' },
        { icon: 'mdi-lock-open', title: 'Sign In', link: '/auth/login' }
      ]

      if (this.isAuthenticated && this.userRole === 'ADMIN') {
        items = [
          { icon: 'mdi-calendar-range', title: 'Academic Years', link: '/years' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'GUEST') {
        items = [
          { icon: 'mdi-file-chart', title: 'View Reports', link: '/reports' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'MANAGER') {
        items = [
          { icon: 'mdi-view-grid-plus', title: 'View Selections', link: '/selections' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'COORDINATOR') {
        items = [
          { icon: 'mdi-view-grid-plus', title: 'View Selections', link: '/selections' },
          { icon: 'mdi-format-list-text', title: 'View Submissions', link: '/submissions' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'STUDENT') {
        items = [
          { icon: 'mdi-format-list-text', title: 'View Submissions', link: '/submissions' }
        ]
      } else if (this.isAuthenticated && this.userRole === 'DEV') {
        items.length = 0
      }

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
