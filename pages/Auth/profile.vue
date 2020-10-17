<template>
  <v-container fill-height>
    <v-row wrap>
      <v-col
        sm="12"
        md="8"
        offset-md="2"
      >
        <v-card
          class="mx-auto"
          max-width="600"
          tile
        >
          <v-img
            height="100%"
            src="/andyone--WW8jBak7bo-unsplash.jpg"
          >
            <v-row
              align="end"
              class="fill-height"
            >
              <v-col class="pb-10">
                <v-list-item
                  color="rgba(0, 0, 0, .4)"
                  dark
                >
                  <v-list-item-content>
                    <v-list-item-title class="display-1 info--text">
                      {{ user.firstName }} {{ user.lastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="subtitle-1 white--text">
                      <strong>
                        {{ user.role }}
                      </strong>
                      in {{ user.faculty }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      v-if="submissions"
      wrap
    >
      <v-col
        sm="12"
        md="10"
        offset-md="1"
      >
        <h1 class="text-center secondary--text">
          {{ submissions.length }} Submissions!
        </h1>
        <v-row>
          <v-col
            v-for="sub in submissions"
            :key="sub._id"
            cols="6"
          >
            <nuxt-link
              :to="`/submissions/${sub._id}`"
            >
              <v-card
                shaped
                max-width="570"
                class="mx-auto mt-12"
                elevation="8"
              >
                <v-img
                  v-if="sub.picture.path"
                  :src="sub.picture.path"
                  height="200"
                />
                <v-img
                  v-else
                  src="https://picsum.photos/200"
                  height="200"
                />
                <v-card-title class="accent--text">
                  {{ sub.title }}
                </v-card-title>
                <v-card-subtitle>
                  submitted {{ new Date(parseInt(sub.createdDate)).toLocaleDateString() }}
                </v-card-subtitle>
              </v-card>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GET_CURRENT_USER from '~/apollo/queries/getCurrentUser.gql'
import GET_USER_SUBMISSIONS from '~/apollo/queries/getUserSubmissions.gql'
export default {
  name: 'Profile',
  data: () => ({
    user: null,
    submissions: null
  }),
  apollo: {
    user: {
      query: GET_CURRENT_USER,
      prefetch: true,
      update (data) {
        return data.getCurrentUser
      }
    },
    submissions: {
      query: GET_USER_SUBMISSIONS,
      prefetch: true,
      variables () {
        return {
          userId: this.user._id
        }
      },
      update (data) {
        return data.getUserSubmissions
      }
    }
  },
  head: {
    title: 'Your Profile'
  }
}
</script>
