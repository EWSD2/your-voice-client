<template>
  <v-container text-center class="secondary--text">
    <v-row>
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <v-card
          shaped
          max-width="570"
          class="mx-auto mt-12"
          elevation="8"
        >
          <v-card-title class="secondary--text">
            {{ getPrettyFaculty(user.faculty) }} Reporting Dashboard
          </v-card-title>
          <v-list two-line>
            <v-row>
              <v-col
                cols="6"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Articles Submitted
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                    >
                      {{ articles.length }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col
                cols="6"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Articles Edited
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                    >
                      {{ editedArticles }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="6"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Articles Without Comments
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                    >
                      {{ noComment }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col
                cols="6"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Two Weeks Without Comments
                    </v-list-item-title>
                    <v-list-item-subtitle
                      class="headline"
                    >
                      {{ twoWeeksNoComment }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <Plotly :data="articleDistribution.chartData" :layout="articleDistribution.layout" :display-mode-bar="false" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>
                  <Plotly :data="submissionDayOverDay.chartData" :layout="submissionDayOverDay.layout" :display-mode-bar="false" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { Plotly } from 'vue-plotly'
import GET_FACULTY_REPORTING from '~/apollo/queries/getFacultyReporting.gql'
export default {
  name: 'Reports',

  components: {
    Plotly
  },

  data: () => ({
    articles: []
  }),

  apollo: {
    articles: {
      query: GET_FACULTY_REPORTING,
      prefetch: true,
      variables () {
        return {
          faculty: this.faculty
        }
      },
      update (data) {
        return data.getFacultyArticles
      }
    }
  },

  computed: {
    ...mapGetters(['user']),

    faculty () {
      return this.user.faculty.toLowerCase()
    },

    noComment () {
      return this.articles.filter(article => article.messages.length === 0).length
    },

    twoWeeksNoComment () {
      const date = new Date()
      date.setDate(date.getDate() - 14)
      return this.articles.filter(article => article.createdDate < date.getTime() && article.messages.length === 0).length
    },

    editedArticles () {
      return this.articles.filter(article => article.editDate != null).length
    },

    articleDistribution () {
      const submitted = this.articles.length
      const toPublish = this.articles.filter(article => article.toBePublished === true).length
      return {
        chartData: [
          {
            x: ['Submitted', 'To Be Published'],
            y: [submitted, toPublish],
            type: 'bar',
            marker: {
              color: 'rgb(17, 129, 178)'
            }
          }
        ],

        layout: {
          title: 'Submitted Articles vs Publication Selections'
        }
      }
    },

    submissionDayOverDay () {
      function getUnique (value, index, self) {
        return self.indexOf(value) === index
      }
      const rawDates = []
      const counts = {}

      this.articles.forEach(article => rawDates.push(new Date(parseInt(article.createdDate)).toLocaleDateString()))

      const uniqueDates = rawDates.filter(getUnique)

      uniqueDates.forEach((date) => {
        counts[date] = this.articles.filter(article => new Date(parseInt(article.createdDate)).toLocaleDateString() === date).length
      })

      return {
        chartData: [
          {
            x: Object.keys(counts),
            y: Object.values(counts),
            type: 'bar',
            marker: {
              color: 'rgb(68, 68, 155)'
            }
          }
        ],

        layout: {
          title: 'Article Submissions Day over Day'
        }
      }
    }
  },

  methods: {
    getPrettyFaculty (faculty) {
      let prettified
      switch (faculty) {
        case 'MATHEMATICS':
          prettified = 'Mathematics'
          break
        case 'COMPSCI':
          prettified = 'Computer Science'
          break
        case 'HUMANITIES':
          prettified = 'Humanities'
          break
        case 'ADMIN':
          prettified = 'Administration'
          break
      }

      return prettified
    }
  },

  head: {
    title: 'Reports'
  }
}
</script>
