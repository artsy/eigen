import { NativeModules } from "react-native"
import * as Relay from "react-relay/classic"
const { Emission } = NativeModules

let metaphysicsURL
let gravityURL

if (Emission && Emission.gravityAPIHost && Emission.metaphysicsAPIHost) {
  metaphysicsURL = Emission.metaphysicsAPIHost
  gravityURL = Emission.gravityAPIHost
} else {
  metaphysicsURL = "https://metaphysics-production.artsy.net"
  gravityURL = "https://api.artsy.net"
}

export { metaphysicsURL, gravityURL }

if (Emission) {
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(metaphysicsURL, {
      headers: {
        "X-USER-ID": Emission.userID,
        "X-ACCESS-TOKEN": Emission.authenticationToken,
      },
    })
  )
}

// Disable the native polyfill during development, which will make network requests show-up in the Chrome dev-tools.
// Specifically, in our case, we get to see the Relay requests.
//
// It will be `undefined` unless running inside Chrome.
//
if (__DEV__ && global.originalXMLHttpRequest !== undefined) {
  global.XMLHttpRequest = global.originalXMLHttpRequest
  // tslint:disable-next-line:no-var-requires
  require("react-relay/lib/RelayNetworkDebug").init()
}
