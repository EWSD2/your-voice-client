<template>
  <v-container text-center>
    <v-row>
      <v-col>
        <h1 class="secondary--text">
          Welcome to Your Voice, {{ user.firstName }}!
        </h1>
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
