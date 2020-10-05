<template>
  <v-container text-center class="secondary--text">
    <v-row>
      <v-col>
        <h1>Academic Year {{ year }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AcademicYear',
  asyncData ({ params }) {
    return {
      year: params.id
    }
  },
  head () {
    return {
      title: this.year ? `Academic Year ${this.year} Details` : 'Academic Year Details'
    }
  }
}
</script>
