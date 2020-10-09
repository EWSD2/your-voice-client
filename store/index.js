export const state = () => ({
  error: null,
  authError: null,
  user: null,
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
  },

  setUser: (state, payload) => {
    state.user = payload
  }
}

export const getters = {
  error: state => state.error,
  authError: state => state.authError,
  user: state => state.user,
  isAuthenticated: state => state.isAuthenticated
}
