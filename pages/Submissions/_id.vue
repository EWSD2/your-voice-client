<template>
  <v-container text-center class="secondary--text">
    <v-row wrap>
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <h1>Submission {{ sub }}</h1>
        <v-divider />
        <v-card
          shaped
          max-width="375"
          class="mx-auto mt-12"
          elevation="8"
        >
          <v-card-title>
            {{ submission.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ `By ${ submission.submittedBy.firstName } ${ submission.submittedBy.lastName } from ${ submission.submittedBy.faculty }` }}
          </v-card-subtitle>
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-clock-start
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Submitted</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(submission.createdDate) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-file-download
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Article Download</v-list-item-title>
                <v-list-item-subtitle>
                  {{ submission.article.path }}
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
import GET_SUBMISSION from '~/apollo/queries/getSubmission.gql'
export default {
  name: 'SubmissionDetails',
  asyncData ({ params }) {
    return {
      sub: params.id,
      submission: {
        title: '',
        submittedBy: {
          firstName: '',
          lastName: '',
          faculty: ''
        },
        createdDate: ''
      }
    }
  },

  data: () => ({ }),

  methods: {
    formatDate (date) {
      return new Date(parseInt(date)).toLocaleDateString()
    }
  },

  apollo: {
    submission: {
      query: GET_SUBMISSION,
      prefetch: true,
      variables () {
        return {
          submissionId: this.sub
        }
      },
      update (data) {
        return data.getSubmission
      }
    }
  },

  head () {
    return {
      title: this.sub ? `Submission ${this.sub} Details` : 'Submission Details'
    }
  }
}
</script>
