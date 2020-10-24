<template>
  <v-container text-center>
    <v-row wrap>
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <h1
          v-if="user.role === 'STUDENT'"
          class="secondary--text"
        >
          Your Articles
        </h1>
        <h1
          v-else
          class="display-1 secondary--text"
        >
          Faculty Submissions
        </h1>
        <v-row wrap>
          <v-col
            cols="6"
            offset="3"
          >
            <v-list three-line>
              <v-list-item-group>
                <v-list-item
                  v-for="article in visibleArticles"
                  :key="article._id"
                  :to="`/submissions/${article._id}`"
                >
                  <v-list-item-avatar
                    v-if="article.picture"
                  >
                    <v-img
                      :src="article.picture.path"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ article.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Created {{ formatDate(article.createdDate) }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle
                      v-if="article.submittedBy"
                    >
                      By {{ article.submittedBy.firstName }} {{ article.submittedBy.lastName }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-pagination
              v-if="articles.length > perPage"
              v-model="page"
              :length="Math.ceil(articles.length/perPage)"
              class="pt-10"
              color="accent"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Submissions',

  data: () => ({
    articles: [],
    page: 1,
    perPage: 10
  }),

  computed: {
    ...mapGetters(['user']),

    visibleArticles () {
      if (this.articles != null) {
        return this.articles.slice((this.page - 1) * this.perPage, this.page * this.perPage)
      } else {
        return null
      }
    }
  },

  async created () {
    const user = this.user
    let query

    if (this.user.role === 'STUDENT') {
      query = require('~/apollo/queries/getUserArticlesListing.gql')
      await this.$apollo.query({
        query,
        variables: {
          userId: user._id
        }
      })
        .then(({ data }) => {
          this.articles = data.getUserArticles
        })
    } else if (this.user.role === 'COORDINATOR') {
      query = require('~/apollo/queries/getFacultyArticles.gql')
      await this.$apollo.query({
        query,
        variables: {
          faculty: user.faculty.toLowerCase()
        }
      })
        .then(({ data }) => {
          this.articles = data.getFacultyArticles
        })
    }
  },

  methods: {
    formatDate (date) {
      return new Date(parseInt(date)).toLocaleDateString()
    }
  },

  head: {
    title: 'Submissions Listing'
  }
}
</script>
