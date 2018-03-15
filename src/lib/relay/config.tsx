import { NativeModules } from "react-native"
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

// Disable the native polyfill during development, which will make network requests show-up in the Chrome dev-tools.
// Specifically, in our case, we get to see the Relay requests.
//
// It will be `undefined` unless running inside Chrome.
//
declare var global: any
if (__DEV__ && global.originalXMLHttpRequest !== undefined) {
  /**
   * TODO: Recording network access in Chrome Dev Tools is disabled for now.
   *
   * @see https://github.com/jhen0409/react-native-debugger/issues/209
   */
  // global.XMLHttpRequest = global.originalXMLHttpRequest

  // tslint:disable-next-line:no-var-requires
  require("react-relay/lib/RelayNetworkDebug").init()
}
