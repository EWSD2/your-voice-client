<template>
  <v-container text-center class="secondary--text fill-height">
    <v-row align="center">
      <v-col
        sm="12"
        md="8"
        offset-md="2"
      >
        <v-card
          sm="12"
          md="8"
          offset-md="2"
          elevation="8"
        >
          <v-img
            src="/logo.png"
            height="200"
            contain
          />
          <v-row>
            <v-col>
              <v-row v-if="error">
                <v-col>
                  <form-alert :message="error.message" />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="10"
                  offset="1"
                >
                  <v-form
                    ref="form"
                    v-model="isFormValid"
                    lazy-validation
                    @submit.prevent="handleSigninUser"
                  >
                    <v-row>
                      <v-col xs12>
                        <v-text-field
                          v-model.trim="username"
                          :rules="usernameRules"
                          prepend-icon="mdi-face"
                          label="Username"
                          type="text"
                          required
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col xs="12">
                        <v-text-field
                          v-model="password"
                          :rules="passwordRules"
                          prepend-icon="mdi-puzzle-outline"
                          label="Password"
                          type="password"
                          required
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col xs="12">
                        <v-btn
                          :disabled="!isFormValid"
                          color="accent"
                          type="submit"
                        >
                          Be Heard
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import FormAlert from '~/components/Shared/FormAlert'
import SIGNIN_USER from '~/apollo/mutations/signinUser.gql'
export default {
  name: 'Login',
  layout: 'login',
  components: {
    FormAlert
  },
  data: () => ({
    isFormValid: true,
    username: '',
    password: '',
    usernameRules: [
      // Check if a username has been supplied
      username => !!username || 'Username is required',
      // Make sure username is less than 16 characters
      username =>
        username.length < 16 || 'Username must be less than 16 characters'
    ],
    passwordRules: [
      password => !!password || 'Password is required',
      password =>
        password.length >= 7 || 'Password must be at least 7 characters'
    ]
  }),
  computed: {
    ...mapGetters(['error'])
  },
  created () {
    const authToken = Cookies.get('apollo-token')
    if (authToken) {
      this.$apolloHelpers.onLogin(authToken)
      this.$store.commit('setIsAuthenticated', true)
      this.$router.push('/')
    }
  },
  methods: {
    async handleSigninUser () {
      const username = this.username
      const password = this.password
      try {
        await this.$apolloHelpers.onLogout()
        await this.$apollo.mutate({
          mutation: SIGNIN_USER,
          variables: {
            username,
            password
          }
        })
          .then(({ data }) => {
            if (data.signinUser.token) {
              this.$apolloHelpers.onLogin(data.signinUser.token)
              this.$store.commit('setIsAuthenticated', true)
              this.$router.push('/')
            }
          })
      } catch (err) {
        this.$store.commit('setError', err)
      }
    }
  },
  head: {
    title: 'Sign In'
  }
}
</script>
