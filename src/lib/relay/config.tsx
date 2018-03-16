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

if (__DEV__) {
  // tslint:disable-next-line:no-var-requires
  require("react-relay/lib/RelayNetworkDebug").init()
}
