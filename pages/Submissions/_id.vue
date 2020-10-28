<template>
  <v-container text-center class="secondary--text">
    <v-row v-if="error">
      <v-col>
        <form-alert :message="error.message" />
      </v-col>
    </v-row>
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
              v-if="user.role === 'COORDINATOR' && submission.toBePublished === false"
              color="accent"
              text
              right
              @click="publishArticle"
            >
              Select for Publication
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
              v-if="new Date().getTime() < submission.academicYear.submissionClose && user.role === 'COORDINATOR' || user.role === 'STUDENT'"
              color="accent"
              text
              right
              @click="editArticleDialog = true"
            >
              Edit Article
            </v-btn>
            <v-btn
              v-if="submission.submittedBy._id === user._id"
              class="error--text"
              text
              right
              @click="confirmDeleteArticle"
            >
              Delete Article
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message Form -->
    <v-row
      v-if="user.role === 'STUDENT' || user.role === 'COORDINATOR'"
      class="mt-3 mb-3"
    >
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <v-form
          ref="commentForm"
          v-model="isCommentFormValid"
          lazy-validation
          @submit.prevent="addArticleMessage"
        >
          <v-textarea
            v-model.trim="messageBody"
            color="accent"
            :rules="messageRules"
            :counter="140"
            prepend-icon="mdi-email"
            :append-outer-icon="messageBody && 'mdi-send'"
            label="Add a Comment"
            required
            @click:append-outer="addArticleMessage"
          />
        </v-form>
      </v-col>
    </v-row>

    <!-- Message List -->
    <v-row v-if="submission.messages != null">
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <v-list subheader two-line>
          <v-subheader>
            Comments: ({{ submission.messages.length }})
          </v-subheader>
          <v-list-item
            v-for="message in submission.messages"
            :key="message._id"
          >
            <v-list-item-avatar>
              <v-img
                :src="message.messageUser.avatar"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ message.messageBody }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ message.messageUser.firstName }}
                {{ message.messageUser.lastName }}
                <span
                  class="grey--text text-lighten-1 hidden-xs-only"
                >
                  {{ getTimeFromNow(message.messageDate) }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon
                :color="checkIfUserMessage(message) ? 'accent' : 'warning'"
              >
                mdi-chat
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <!-- Edit Article Dialog -->
    <v-dialog
      v-model="editArticleDialog"
      persistent
      max-width="650px"
    >
      <v-card
        sm="12"
        md="8"
        offset-md="2"
        shaped
      >
        <v-card-title class="headline secondary--text">
          Update Article
        </v-card-title>
        <v-row>
          <v-col
            cols="12"
          >
            <v-form
              ref="form"
              v-model="isFormValid"
              lazy-validation
              @submit.prevent="updateArticle"
            >
              <v-row>
                <v-col
                  cols="10"
                  md="8"
                  offset="1"
                  offset-md="2"
                >
                  <v-file-input
                    v-model="article"
                    :rules="articleRules"
                    show-size
                    accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    placeholder="Select your article"
                    label="Article"
                    required
                  />
                </v-col>
                <v-col
                  cols="10"
                  md="8"
                  offset="1"
                  offset-md="2"
                >
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      :disabled="!isFormValid"
                      class="accent--text"
                      text
                      type="submit"
                    >
                      Update Article
                    </v-btn>
                    <v-btn
                      class="error--text"
                      text
                      right
                      @click="editArticleDialog = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import GET_ARTICLE from '~/apollo/queries/getArticle.gql'
import SUBMIT_ARTICLE from '~/apollo/mutations/submitArticle.gql'
import UPDATE_ARTICLE from '~/apollo/mutations/updateArticle.gql'
import DELETE_ARTICLE from '~/apollo/mutations/deleteArticle.gql'
import GET_USER_ARTICLES from '~/apollo/queries/getUserArticles.gql'
import SELECT_FOR_PUBLICATION from '~/apollo/mutations/selectForPublication.gql'
import ADD_ARTICLE_MESSAGE from '~/apollo/mutations/addArticleMessage.gql'
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
        academicYear: {
          submissionClose: ''
        },
        article: {
          path: ''
        },
        picture: {
          path: ''
        },
        messages: []
      }
    }
  },

  data: () => ({
    editArticleDialog: false,
    isFormValid: true,
    isCommentFormValid: true,
    canSubmit: true,
    article: null,
    articleRules: [
      article => !!article || 'Please select the article to be submitted'
    ],
    messageBody: '',
    messageRules: [
      message => !!message || 'Come back when you have something to say!',
      message => message.length <= 140 || 'Save your essay for the article.'
    ]
  }),

  computed: {
    ...mapGetters(['user', 'error'])
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
      // return new Date(parseInt(date)).toLocaleDateString()
      return moment(new Date(parseInt(date))).format('ll')
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
    },

    async uploadFile (file, username) {
      const storageRef = this.$fireStorage.ref(`/submissions/${username}/${file.name}`)
      let url
      try {
        await storageRef.put(file)
        url = await storageRef.getDownloadURL()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${err.message}`
        })
      }
      return {
        filename: file.name,
        mimetype: file.type,
        path: url
      }
    },

    async deleteFile (path) {
      const storageRef = this.$fireStorage.refFromURL(path)
      try {
        await storageRef.delete()
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${err.message}`
        })
      }
    },

    async updateArticle () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$loading.start()
        const username = this.user.username
        const articleId = this.sub
        const article = this.article
        const oldArticle = this.submission.article.path

        try {
          await this.deleteFile(oldArticle)
          const articleDetails = await this.uploadFile(article, username)
          await this.$apollo.mutate({
            mutation: UPDATE_ARTICLE,
            variables: {
              articleId,
              editDate: new Date().toISOString(),
              newArticle: articleDetails
            }
          })
            .then(({ data }) => {
              this.$apollo.queries.submission.refetch()
              this.$nuxt.$loading.finish()
              this.editArticleDialog = false
            })
        } catch (err) {
          this.$nuxt.$loading.finish()
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${err.message}`
          })
        }
      }
    },

    confirmDeleteArticle () {
      Swal.fire({
        title: 'Are you sure?',
        text: `Delete ${this.submission.title}? You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff5722',
        cancelButtonColor: '#44449b',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteArticle()
        }
      })
    },

    async deleteArticle () {
      const article = this.submission.article.path
      const picture = this.submission.picture.path
      const articleId = this.sub

      this.$nuxt.$loading.start()

      await this.$apollo.mutate({
        mutation: DELETE_ARTICLE,
        variables: {
          articleId
        },
        update: (store, { data: { deleteArticle } }) => {
          const data = store.readQuery({ query: GET_USER_ARTICLES })
          const removed = data.find(article => article._id === articleId)
          data.pop(data.indexOf(removed))

          store.writeQuery({ query: GET_USER_ARTICLES, data })
        }
      })
        .then(async ({ data }) => {
          if (data.deleteArticle._id) {
            await this.deleteFile(article)

            if (picture) {
              await this.deleteFile(picture)
            }

            this.$nuxt.$loading.finish()

            this.$router.push('/submissions/')
          }
        })
        .catch((err) => {
          this.$nuxt.$loading.finish()
          this.$store.commit('setError', err)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${err.message}`
          })
        })
    },

    async publishArticle () {
      const articleId = this.sub

      this.$nuxt.$loading.start()

      await this.$apollo.mutate({
        mutation: SELECT_FOR_PUBLICATION,
        variables: {
          articleId
        },
        update: (store, { data: { selectForPublication } }) => {
          const data = selectForPublication
          store.writeQuery({ query: GET_ARTICLE, data })
        }
      })
        .then(async ({ data }) => {
          await this.$apollo.queries.submission.refetch()
          this.$nuxt.$loading.finish()
          Swal.fire({
            icon: 'success',
            title: 'Straight to the Presses!',
            text: `${this.submission.title} by ${this.submission.submittedBy.firstName} ${this.submission.submittedBy.lastName} has been selected for publication.`
          })
        })
        .catch((err) => {
          this.$nuxt.$loading.finish()
          this.$store.commit('setError', err)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${err.message}`
          })
        })
    },

    async addArticleMessage () {
      if (this.$refs.commentForm.validate()) {
        const articleId = this.sub
        const userId = this.user._id
        const messageBody = this.messageBody

        await this.$apollo.mutate({
          mutation: ADD_ARTICLE_MESSAGE,
          variables: {
            articleId,
            userId,
            messageBody
          },
          update: (store, { data: { addArticleMessage } }) => {
            const data = store.readQuery({
              query: GET_ARTICLE,
              variables: { articleId: this.sub }
            })

            data.getArticle.messages.unshift(addArticleMessage)

            store.writeQuery({
              query: GET_ARTICLE,
              variables: { articleId: this.sub },
              data
            })
          }
        })
          .then(({ data }) => {
            this.$refs.commentForm.reset()
            this.$apollo.queries.submission.refetch()
          })
          .catch((err) => {
            this.$nuxt.$loading.finish()
            this.$store.commit('setError', err)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${err.message}`
            })
          })
      }
    },

    getTimeFromNow (time) {
      return moment(new Date(parseInt(time))).fromNow()
    },

    checkIfUserMessage (message) {
      return this.user && this.user._id === message.messageUser._id
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
      title: this.sub ? `${this.submission.title} Details` : 'Submission Details'
    }
  }
}
</script>
