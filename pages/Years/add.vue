<template>
  <v-container text-center>
    <v-row wrap>
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
            Create an Academic Year
          </v-card-title>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="createYear"
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
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                      :rules="startDateRules"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    color="secondary"
                    @input="menu = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="endDate"
                      label="End Date"
                      :rules="[endDateRules2.exists(), endDateRules2.notBeforeStart(startDate)]"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    color="secondary"
                    @input="menu2 = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-menu
                  v-model="menu3"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="submissionClose"
                      label="Submission Close Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="submissionClose"
                    color="secondary"
                    @input="menu3 = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="10"
                md="8"
                offset="1"
                offset-md="2"
              >
                <v-select
                  v-model="status"
                  :items="statusOptions"
                  label="Status"
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
                    Create Year
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
import CREATE_ACADEMIC_YEAR from '~/apollo/mutations/createAcademicYear.gql'
const Swal = require('sweetalert2')

export default {
  name: 'CreateAcademicYear',
  data: () => ({
    isFormValid: true,
    menu: false,
    menu2: false,
    menu3: false,
    title: '',
    startDate: '',
    endDate: '',
    submissionClose: '',
    status: '',
    statusOptions: ['open', 'close'],
    titleRules: [
      // Check if Title has been provided
      title => !!title || 'Academic Year Title is required',
      // Check if the Title is longer than 40 characters
      title => title.length < 41 || 'Title must have less than 40 characters'
    ],
    startDateRules: [
      // check if a startDate has been provided
      date => !!date || 'Start Date required'
    ],
    endDateRules2: {
      notBeforeStart (start) {
        return date => date > start || 'The Year cannot end before beginning!'
      },
      exists () {
        return date => !!date || 'End Date required'
      }
    }
  }),

  methods: {
    async createYear () {
      const title = this.title
      const startDate = this.startDate
      const endDate = this.endDate
      const submissionClose = this.submissionClose
      const status = this.status

      await this.$apollo.mutate({
        mutation: CREATE_ACADEMIC_YEAR,
        variables: {
          title,
          startDate,
          endDate,
          submissionClose,
          status
        }
      })
        .then(({ data }) => {
          const id = data.createAcademicYear._id
          if (id) {
            this.$router.push(`/years/${id}`)
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${err.message}`
          })
        })
    },

    checkEndDate () {
      if (this.endDate < this.startDate) {
        this.isFormValid = false
        Swal.fire({
          icon: 'error',
          title: 'That seems weird...',
          timer: 2500,
          text: 'Years can\'t end before they begin!'
        })
      }
    }
  },

  head: {
    title: 'Add an Academic Year'
  }
}
</script>
