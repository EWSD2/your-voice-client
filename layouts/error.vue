<template>
  <v-app dark>
    <v-container fluid fill-height grid-list-md text-center>
      <v-layout row wrap align-center justify-center>
        <v-flex xs12>
          <v-card height="400" color="transparent" flat>
            <div class="display-3 mt-5">
              Page not found.
            </div>
            <div class="grey--text lighten-5" mb-4>
              The page you are trying to get to never existed in this reality,
              or has migrated to a parallel universe.
            </div>
            <div class="paragraph-text mt-5">
              <p class="mt-5">
                Try going back to the
                <NuxtLink to="/">
                  home page
                </NuxtLink>
                and repeating your action.
              </p>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
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
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
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
h1 {
  font-size: 20px;
}
</style>
