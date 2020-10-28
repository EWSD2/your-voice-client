<template>
  <v-container text-center>
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
        <h1 class="secondary--text">
          Academic Year {{ year.title }}
        </h1>
        <v-divider />
        <v-card
          shaped
          max-width="375"
          class="mx-auto mt-12"
          elevation="8"
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

            <v-list-item v-if="year.submissionClose">
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

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="accent"
                text
                right
                @click="toggleStatus"
              >
                {{ year.status === 'CLOSED' ? 'Open Year' : 'Close Year' }}
              </v-btn>
              <v-btn
                color="accent"
                text
                right
                @click="loadYear"
              >
                Edit Dates
              </v-btn>
            </v-card-actions>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Year Dialog -->
    <v-dialog
      v-model="editYearDialog"
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
          Update Year
        </v-card-title>
        <v-row>
          <v-col
            cols="12"
          >
            <v-form
              ref="form"
              v-model="isFormValid"
              lazy-validation
              @submit.prevent="updateDates"
            >
              <v-row>
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
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      :disabled="!isFormValid"
                      class="accent--text"
                      text
                      type="submit"
                    >
                      Update Year
                    </v-btn>
                    <v-btn
                      class="error--text"
                      text
                      right
                      @click="editYearDialog = false"
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
import GET_ACADEMIC_YEAR from '~/apollo/queries/getAcademicYear.gql'
import TOGGLE_YEAR_STATUS from '~/apollo/mutations/editAcademicYearStatus.gql'
import UPDATE_YEAR_DATES from '~/apollo/mutations/editAcademicYearDates.gql'
export default {
  name: 'AcademicYear',
  asyncData ({ params }) {
    return {
      yearId: params.id
    }
  },
  data: () => ({
    year: {
      title: ''
    },
    editYearDialog: false,
    isFormValid: true,
    menu: false,
    menu2: false,
    menu3: false,
    title: '',
    startDate: '',
    endDate: '',
    submissionClose: '',
    status: '',
    statusOptions: ['OPEN', 'CLOSED'],
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
    },

    ...mapGetters(['error'])
  },
  methods: {
    formatDate (date) {
      // return new Date(parseInt(date)).toLocaleDateString()
      return moment(new Date(parseInt(date))).utcOffset(4).format('ll')
    },

    async toggleStatus () {
      const yearId = this.yearId
      const newStat = this.year.status === 'OPEN' ? 'closed' : 'open'
      await this.$apollo.mutate({
        mutation: TOGGLE_YEAR_STATUS,
        variables: {
          yearId,
          status: newStat
        },
        update: (store, { data: { editAcademicYearStatus } }) => {
          const data = editAcademicYearStatus
          store.writeQuery({ query: GET_ACADEMIC_YEAR, data })
        }
      })
        .then(({ data }) => {
          this.$apollo.queries.year.refetch()
        })
        .catch((err) => {
          this.$store.commit('setError', err)
        })
    },

    async updateDates () {
      const yearId = this.yearId
      const startDate = this.startDate
      const endDate = this.endDate
      const submissionClose = this.submissionClose

      await this.$apollo.mutate({
        mutation: UPDATE_YEAR_DATES,
        variables: {
          yearId,
          startDate,
          endDate,
          submissionClose
        },
        update: (store, { data: { editAcademicYearDates } }) => {
          const data = editAcademicYearDates
          store.writeQuery({ query: GET_ACADEMIC_YEAR, data })
        }
      })
        .then(({ data }) => {
          this.editYearDialog = false
          this.$apollo.queries.year.refetch()
        })
        .catch((err) => {
          this.$store.commit('setError', err)
        })
    },

    loadYear () {
      this.startDate = this.buildDateString(this.year.startDate)
      this.endDate = this.buildDateString(this.year.endDate)
      this.submissionClose = this.buildDateString(this.year.submissionClose)
      this.editYearDialog = true
    },

    buildDateString (date) {
      // return new Date(parseInt(date)).toJSON()
      return moment(new Date(parseInt(date))).utcOffset(4).format('L')
    }
  },
  head () {
    return {
      title: this.yearId ? `Academic Year ${this.yearId} Details` : 'Academic Year Details'
    }
  }
}
</script>
