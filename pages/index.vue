<template>
  <v-container text-center>
    <v-row wrap>
      <v-col
        cols="12"
      >
        <v-row>
          <v-img
            src="/logo.png"
            height="250"
            max-height="300"
            contain
            class="pb-5"
          />
        </v-row>
        <v-row>
          <v-banner
            two-line
            elevation="8"
          >
            <v-avatar
              slot="icon"
              color="accent"
              size="40"
            >
              <v-icon
                color="white"
                icon="mdi-human-greeting"
              >
                mdi-human-greeting
              </v-icon>
            </v-avatar>
            <p class="headline secondary--text">
              Welcome to Your Voice, {{ user.firstName }}!
              Please select an option from the sidebar.
            </p>
            <template v-slot:actions>
              <v-btn
                v-if="user.role === 'STUDENT' || user.role === 'DEV'"
                text
                color="accent"
                to="/auth/profile"
              >
                Profile
              </v-btn>
            </template>
          </v-banner>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GET_CURRENT_USER from '~/apollo/queries/getCurrentUser'
export default {
  name: 'Home',
  data: () => ({
    user: {
      firstName: ''
    }
  }),
  apollo: {
    user: {
      query: GET_CURRENT_USER,
      update (data) {
        return data.getCurrentUser
      },
      result ({ data }) {
        this.$store.commit('setUser', data.getCurrentUser)
      }
    }
  },
  head: {
    title: 'Home'
  }
}
</script>
