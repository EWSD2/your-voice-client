<template>
  <v-container text-center>
    <v-row>
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <h1
          class="display-1 secondary--text"
        >
          Publication Selections Listing
        </h1>
        <v-row wrap>
          <v-col
            cols="8"
            offset="2"
          >
            <v-list two-line>
              <v-list-item-group>
                <v-list-item
                  v-for="selection in visibleSelections"
                  :key="selection._id"
                  :to="`/submissions/${selection._id}`"
                >
                  <v-list-item-avatar
                    v-if="selection.picture"
                  >
                    <v-img
                      :src="selection.picture.path"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ selection.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      By {{ selection.submittedBy.firstName }} {{ selection.submittedBy.lastName }} in {{ getPrettyFaculty(selection.faculty) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-pagination
              v-if="selections.length > perPage"
              v-model="page"
              :length="Math.ceil(selections.length/perPage)"
              class="pt-10"
              color="accent"
            />
            <v-btn
              class="mt-10"
              color="accent"
              @click="downloadSelections"
            >
              Download Selections
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GET_PUBLICATION_SELECTIONS from '~/apollo/queries/getPublicationSelections.gql'
// const Swal = require('sweetalert2')
export default {
  name: 'Selections',

  data: () => ({
    selections: [],
    page: 1,
    perPage: 5
  }),

  apollo: {
    selections: {
      query: GET_PUBLICATION_SELECTIONS,
      prefetch: true,
      update (data) {
        return data.getPublicationSelections
      }
    }
  },

  computed: {
    visibleSelections () {
      if (this.selections != null) {
        return this.selections.slice(
          (this.page - 1) * this.perPage, this.page * this.perPage
        )
      } else {
        return null
      }
    }
  },

  methods: {
    formatDate (date) {
      return new Date(parseInt(date)).toLocaleDateString()
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

    downloadSelections () {
      const files = []
      this.selections.forEach(async selection => files.push(await this.getFile(selection.article.path)))

      console.log(files)
    },

    async getFile (path) {
      const file = await this.$axios.$get(
        path,
        { responseType: 'blob' }
      )
      return file
    }
  },

  head: {
    title: 'Publication Selections Listing'
  }
}
</script>
