export const state = () => ({
  error: null,
  authError: null,
  isAuthenticated: false,
  userRole: ''
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

  setUserRole: (state, payload) => {
    state.userRole = payload
  }
}

export const getters = {
  error: state => state.error,
  authError: state => state.authError,
  isAuthenticated: state => state.isAuthenticated,
  userRole: state => state.userRole
}
