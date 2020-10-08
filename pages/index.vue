<template>
  <v-container text-center>
    <v-row>
      <v-col
        cols="12"
      >
        <v-banner
          two-line
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
              text
              color="accent"
            >
              Profile
            </v-btn>
          </template>
        </v-banner>
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
        this.$store.commit('setUserRole', data.getCurrentUser.role)
      }
    }
  },
  head: {
    title: 'Home'
  }
}
</script>
