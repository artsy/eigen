// Comes from https://github.com/facebook/relay/issues/161
// Should be used in tests as a replacement for `react-storybooks-relay-container`
//
var Relay = require.requireActual('react-relay')

module.exports = {
  QL: Relay.QL,
  Mutation: Relay.Mutation,
  Route: Relay.Route,
  createContainer: (component) => component,
}