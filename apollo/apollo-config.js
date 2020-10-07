export default () => {
  return {
    httpEndpoint: 'http://161.35.59.204/graphql',
    httpLinkOptions: {
      credentials: 'include'
    },
    errorHandler: '~/plugins/apollo-error-handlers.js',
    authenticationType: '',
    cookieAttributes: {
      secure: true
    }
  }
}
