/**
 ** Code sourced from @nuxt/apollo official documentation at
 ** https://github.com/nuxt-community/apollo-module
*/

export default ({ graphQLErrors, networkError, operation, forward }, nuxtContext) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.name === 'AuthenticationError') {
        nuxtContext.store.commit('auth/setAuthError', err)
        nuxtContext.app.$apolloHelpers.onLogout()
      }
    }
  }
}
