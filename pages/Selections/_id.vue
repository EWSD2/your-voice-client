<template>
  <v-container text-center class="secondary--text">
    <v-row>
      <v-col>
        <h1>Selection {{ selection }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SelectionDetails',
  asyncData ({ params }) {
    return {
      selection: params.id
    }
  },
  head () {
    return {
      title: this.selection ? `Selection ${this.sub} Details` : 'Selection Details'
    }
  }
}
</script>
