<template>
  <v-container text-center class="secondary--text">
    <v-row wrap>
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
            {{ submission.title }}
          </v-card-title>
          <v-img
            v-if="submission.picture.path"
            height="200"
            :src="submission.picture.path"
          />
          <v-card-subtitle
            class="overline"
          >
            {{ `By ${ submission.submittedBy.firstName } ${ submission.submittedBy.lastName } in ${ getPrettyFaculty(submission.faculty) }` }}
          </v-card-subtitle>
          <v-list two-line>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-clock-start
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Created</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(submission.createdDate) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              v-if="submission.editDate"
            >
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-file-edit-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Last Edited</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(submission.editDate) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-file-send-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Article Submitted</v-list-item-title>
                <v-list-item-subtitle
                  :class="`${statusColour(submission.isSubmitted)}--text`"
                >
                  {{ formatBool(submission.isSubmitted) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-file-star-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Article Selected for Publication</v-list-item-title>
                <v-list-item-subtitle
                  :class="`${statusColour(submission.toBePublished)}--text`"
                >
                  {{ formatBool(submission.toBePublished) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="accent">
                  mdi-file-download-outline
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Article Download</v-list-item-title>
                <v-list-item-subtitle>
                  <a :href="submission.article.path">Download</a>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="user.role === 'COORDINATOR'"
              color="accent"
              text
              right
            >
              Select Article
            </v-btn>
            <v-btn
              v-if="user.role === 'STUDENT' && submission.isSubmitted === false"
              color="accent"
              text
              right
              @click="submitArticle"
            >
              Submit Article
            </v-btn>
            <v-btn
              color="accent"
              text
              right
            >
              Edit Article
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GET_ARTICLE from '~/apollo/queries/getArticle.gql'
import SUBMIT_ARTICLE from '~/apollo/mutations/submitArticle.gql'
const Swal = require('sweetalert2')
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
        createdDate: '',
        article: {
          path: ''
        },
        picture: {
          path: ''
        }
      }
    }
  },

  data: () => ({
    editArticleDialog: false
  }),

  computed: {
    ...mapGetters(['user'])
  },

  watch: {
    sub (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$apollo.queries.submission.refetch({
          submissionId: this.newValue
        })
      }
    }
  },

  methods: {
    formatDate (date) {
      return new Date(parseInt(date)).toLocaleDateString()
    },

    formatBool (bool) {
      return bool === true ? 'Yes' : 'No'
    },

    statusColour (status) {
      return status === true ? 'success' : 'normal'
    },

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
    },

    async submitArticle () {
      const articleId = this.sub
      const faculty = this.user.faculty.toLowerCase()
      const student = `${this.user.firstName} ${this.user.lastName}`

      this.$nuxt.$loading.start()
      await this.$apollo.mutate({
        mutation: SUBMIT_ARTICLE,
        variables: {
          articleId,
          student,
          faculty
        },
        update: (store, { data: { submitArticle } }) => {
          const data = submitArticle
          store.writeQuery({ query: GET_ARTICLE, data })
        }
      })
        .then(({ data }) => {
          this.$apollo.queries.submission.refetch({
            articleId: this.sub
          })
          this.$nuxt.$loading.finish()
          Swal.fire({
            icon: 'success',
            title: 'Straight to the Presses!',
            text: 'Your article has been submitted, and your Coordinator notified!'
          })
        })
        .catch((err) => {
          this.$nuxt.$loading.finish()
          this.$store.commit('setError', err)
        })
    }
  },

  apollo: {
    submission: {
      query: GET_ARTICLE,
      prefetch: true,
      variables () {
        return {
          articleId: this.sub
        }
      },
      update (data) {
        return data.getArticle
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
