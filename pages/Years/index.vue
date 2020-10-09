<template>
  <v-container text-center class="secondary--text">
    <v-row>
      <v-col>
        <h1>Academic Years</h1>
        <v-row wrap>
          <v-col
            sm="12"
            md="8"
            offset-md="2"
          >
            <v-list>
              <v-list-item-group>
                <v-list-item
                  v-for="year in visibleYears"
                  :key="year._id"
                  :to="`/years/${year._id}`"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ year.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-pagination
              v-if="academicYears.length > 10"
              v-model="page"
              :length="Math.ceil(academicYears.length/perPage)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GET_ACADEMIC_YEARS from '~/apollo/queries/getAcademicYears.gql'
export default {
  name: 'AcademicYears',
  data: () => ({
    academicYears: [],
    page: 1,
    perPage: 10
  }),
  computed: {
    visibleYears () {
      return this.academicYears.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    }
  },
  apollo: {
    academicYears: {
      query: GET_ACADEMIC_YEARS,
      update (data) {
        return data.getAcademicYears
      }
    }
  },
  head: {
    title: 'Academic Year Listing'
  }
}
</script>
