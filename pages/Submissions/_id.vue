<template>
  <v-container text-center class="secondary--text">
    <v-row>
      <v-col>
        <h1>Submission {{ sub }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'SubmissionDetails',
  asyncData ({ params }) {
    return {
      sub: params.id
    }
  },
  head () {
    return {
      title: this.sub ? `Submission ${this.sub} Details` : 'Submission Details'
    }
  }
}
</script>
