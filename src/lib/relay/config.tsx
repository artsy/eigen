import { NativeModules } from "react-native"
const { Emission } = NativeModules

let metaphysicsURL
let gravityURL

// if (Emission && Emission.gravityURL && Emission.metaphysicsURL) {
//   metaphysicsURL = Emission.metaphysicsURL
//   gravityURL = Emission.gravityURL
// } else {
// metaphysicsURL = "https://metaphysics-production.artsy.net"
metaphysicsURL = "http://localhost:5001"
gravityURL = "https://api.artsy.net"
// gravityURL = "https://stagingapi.artsy.net"
// }

export { metaphysicsURL, gravityURL }

if (__DEV__) {
  // tslint:disable-next-line:no-var-requires
  require("react-relay/lib/RelayNetworkDebug").init()
}
