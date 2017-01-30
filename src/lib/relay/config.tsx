import Relay from 'react-relay'
import { NativeModules } from 'react-native'
const { Emission } = NativeModules

let metaphysicsURL
if (Emission.useStagingEnvironment) {
  metaphysicsURL = 'https://metaphysics-staging.artsy.net'
} else {
  metaphysicsURL = 'https://metaphysics-production.artsy.net'
}

export { metaphysicsURL }

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(metaphysicsURL, {
    headers: {
      'X-USER-ID': Emission.userID,
      'X-ACCESS-TOKEN': Emission.authenticationToken,
    }
  })
)

// Disable the native polyfill during development, which will make network requests show-up in the Chrome dev-tools.
// Specifically, in our case, we get to see the Relay requests.
//
// It will be `undefined` unless running inside Chrome.
//
// See:
// * https://github.com/facebook/react-native/blob/2d0051f21371e8a51fde836c62a474a941023dd4/Libraries/JavaScriptAppEngine/Initialization/InitializeJavaScriptAppEngine.js#L41-L56
// * https://github.com/facebook/react-native/issues/934
//
if (__DEV__ && global.originalXMLHttpRequest !== undefined) {
  global.XMLHttpRequest = global.originalXMLHttpRequest
  require('react-relay/lib/RelayNetworkDebug').init()
}
