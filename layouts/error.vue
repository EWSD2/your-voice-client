<template>
  <v-app dark>
    <v-container fluid fill-height text-center>
      <v-row>
        <v-col
          sm="12"
          md="8"
          offset-md="2"
        >
          <v-card
            class="mx-auto"
            color="primary"
            dark
            outlined
          >
            <v-card-title primary-title class="justify-center">
              {{ message }}
            </v-card-title>
            <v-card-subtitle v-if="error.statusCode === 404">
              The page you are trying to get to never existed in this reality, or has migrated to a parallel universe.
            </v-card-subtitle>

            <v-card-actions class="justify-center">
              <v-btn
                color="secondary"
                outlined
                rounded
                to="/"
              >
                Go home
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    message () {
      let message = ''
      if (this.error.statusCode === 404) {
        message = '404 Not Found'
      } else {
        message = 'An error occurred'
      }
      return message
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
.v-main {
  background-color: #212221 !important;
}
</style>
