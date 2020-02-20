// Comes from https://github.com/facebook/relay/issues/161
// Should be used in tests as a replacement for `react-storybooks-relay-container`
//
var Relay = require.requireActual("react-relay")

module.exports = {
  createFragmentContainer: component => component,
  createPaginationContainer: component => component,
  createRefetchContainer: component => component,
  graphql: Relay.graphql,
  commitMutation: (environment, { onCompleted, onError }) => {
    onCompleted && onCompleted()
  },
}
