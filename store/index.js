export const state = () => ({
  error: null,
  authError: null,
  isAuthenticated: false
})

export const mutations = {
  setError: (state, payload) => {
    state.error = payload
  },

  setAuthError: (state, payload) => {
    state.authError = payload
  },

  setIsAuthenticated: (state, payload) => {
    state.isAuthenticated = payload
  }
}

export const getters = {
  error: state => state.error,
  authError: state => state.authError,
  isAuthenticated: state => state.isAuthenticated
}
