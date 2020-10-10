<template>
  <v-container text-center>
    <v-row wrap>
      <v-col
        sm="12"
        md="8"
        offset-md="2"
      >
        <h1 class="secondary--text">
          Academic Year {{ year.title }}
        </h1>
        <v-divider />
        <v-card
          shaped
          max-width="375"
          class="mx-auto mt-12"
        >
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon :color="statusColour">
                  mdi-list-status
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title
                  :class="`${statusColour}--text`"
                >
                  Status
                </v-list-item-title>
                <v-list-item-subtitle
                  :class="`${statusColour}--text`"
                >
                  {{ year.status }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-clock-start
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Start Date</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(year.startDate) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-clock-end
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>End Date</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(year.endDate) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-alarm-bell
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Submission Close Date</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(year.submissionClose) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GET_ACADEMIC_YEAR from '~/apollo/queries/getAcademicYear.gql'
export default {
  name: 'AcademicYear',
  asyncData ({ params }) {
    return {
      yearId: params.id,
      year: {
        title: ''
      }
    }
  },
  data: () => ({
    year: {
      title: ''
    }
  }),
  apollo: {
    year: {
      query: GET_ACADEMIC_YEAR,
      prefetch: true,
      variables () {
        return {
          yearId: this.yearId
        }
      },
      update (data) {
        return data.getAcademicYear
      }
    }
  },
  computed: {
    statusColour () {
      return this.year.status === 'OPEN' ? 'success' : 'error'
    }
  },
  methods: {
    formatDate (date) {
      return new Date(parseInt(date)).toLocaleDateString()
    }
  },
  head () {
    return {
      title: this.yearId ? `Academic Year ${this.yearId} Details` : 'Academic Year Details'
    }
  }
}
</script>
