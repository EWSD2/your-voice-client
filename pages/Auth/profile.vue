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
              <v-col
                align-self="start"
                cols="12"
                class="pa-0"
              >
                <v-avatar
                  class="profile"
                  size="164"
                  tile
                >
                  <v-img
                    :src="user.avatar"
                  />
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item
                  color="rgba(0, 0, 0, .4)"
                  dark
                >
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      {{ user.firstName }} {{ user.lastName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
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
  </v-container>
</template>

<script>
import GET_CURRENT_USER from '~/apollo/queries/getCurrentUser.gql'
export default {
  name: 'Profile',
  data: () => ({
    user: null
  }),
  apollo: {
    user: {
      query: GET_CURRENT_USER,
      prefetch: true,
      update (data) {
        return data.getCurrentUser
      }
    }
  },
  head: {
    title: 'Your Profile'
  }
}
</script>
