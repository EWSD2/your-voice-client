<template>
  <v-container text-center class="secondary--text">
    <v-row v-if="error">
      <v-col>
        <form-alert :message="error.message" />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <v-card
          sm="12"
          md="8"
          offset-md="2"
          shaped
          elevation="8"
        >
          <v-card-title class="headline secondary--text">
            Create an Article
          </v-card-title>
          <v-form
            ref="form"
            v-model="isFormValid"
            enctype="multipart/form-data"
            lazy-validation
            @submit.prevent="makeSubmission"
          >
            <v-row>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  :counter="40"
                  label="Title"
                  clearable
                  required
                />
              </v-col>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-select
                  v-model="yearId"
                  :items="academicYears"
                  item-text="title"
                  item-value="_id"
                  :rules="yearRules"
                  label="Academic Year"
                  required
                />
              </v-col>
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
                <v-file-input
                  v-model="picture"
                  show-size
                  accept="image/*"
                  placeholder="Pick a cover image"
                  prepend-icon="mdi-camera"
                  label="Picture"
                />
              </v-col>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-checkbox
                  v-model="terms"
                  label="I agree to the Terms and Conditions"
                  :rules="termsRules"
                  color="secondary"
                />
              </v-col>
              <v-col
                cols="12"
                md="8"
                offset-md="2"
              >
                <v-spacer />
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    class="accent--text"
                    text
                    right
                    :disabled="!isFormValid"
                    type="submit"
                  >
                    Create Article
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import GET_OPEN_AY from '~/apollo/queries/getOpenAcademicYears.gql'
import CREATE_ARTICLE from '~/apollo/mutations/createArticle.gql'
const Swal = require('sweetalert2')

export default {
  name: 'AddSubmission',

  data: () => ({
    isFormValid: true,
    canSubmit: true,
    title: '',
    yearId: '',
    academicYears: [],
    article: null,
    picture: null,
    terms: true,
    titleRules: [
      // Check if Title has been provided
      title => !!title || 'Submission Title is required',
      // Check if the Title is longer than 40 characters
      title => title.length < 41 || 'Title must have less than 40 characters'
    ],
    yearRules: [
      // Check if a year has been selected
      year => !!year || 'Please specify the Academic Year'
    ],
    articleRules: [
      article => !!article || 'Please select the article to be submitted'
    ],
    termsRules: [
      terms => terms === true || 'Please agree to the terms and conditions'
    ]
  }),

  computed: {
    ...mapGetters(['error', 'user'])
  },

  apollo: {
    academicYears: {
      query: GET_OPEN_AY,
      prefetch: true,
      update (data) {
        return data.getOpenAcademicYears
      }
    }
  },

  watch: {
    yearId (value) {
      const acYr = this.academicYears.find(year => year._id === value)
      const now = new Date().getTime()
      const valid = acYr.submissionClose > now
      this.isFormValid = valid
      if (valid === false) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'The submission window for this year has closed.'
        })
      }
    }
  },

  methods: {
    async makeSubmission () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$loading.start()
        const userId = this.user._id
        const faculty = this.user.faculty.toLowerCase()
        const username = this.user.username
        const createdDate = new Date()
        const title = this.title
        const yearId = this.yearId
        const article = this.article
        const picture = this.picture
        const articleDetails = await this.uploadFile(article, username)
        let pictureDetails = null
        if (picture) {
          pictureDetails = await this.uploadFile(picture, username)
        }

        await this.$apollo.mutate({
          mutation: CREATE_ARTICLE,
          variables: {
            title,
            userId,
            createdDate,
            yearId,
            faculty,
            article: articleDetails,
            picture: pictureDetails
          }
        })
          .then(({ data }) => {
            this.$nuxt.$loading.finish()
            const id = data.createArticle._id
            if (id) {
              this.$router.push(`/submissions/${id}`)
            }
          })
          .catch((err) => {
            this.$nuxt.$loading.finish()
            this.$store.commit('setError', err)
          })
      }
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
    }
  },

  head: {
    title: 'Make a Submission'
  }
}
</script>
