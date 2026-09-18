import { registerRootComponent } from "expo"
import "expo-asset"

global.__TEST__ = false

// for more info about metaflags, look [here](/docs/metaflags.md)
let metaflags = {}

if (__DEV__) {
  const {
    mockSyncFunctionsWhenDebugging,
  } = require("./src/app/system/devTools/mockSyncFunctionsWhenDebugging")

  // Ensure we don't break the debugger
  mockSyncFunctionsWhenDebugging()

  try {
    const fileContents = require("./metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch {
    // ignore error
  }
}

import "react-native-url-polyfill/auto"

// `expo/fetch` exposes a response body only when WHATWG streams exist, which `graphql-sse`
// needs for our Metaphysics subscriptions. `@expo/cli` injects this polyfill as a Metro
// polyfill, so it is already there in release bundles and under `expo run:ios|android` — but
// not under `yarn start`, which uses the React Native CLI. Installing it unconditionally
// would define a second, competing set of stream classes, so only fill the gap.
if (typeof globalThis.ReadableStream === "undefined") {
  require("expo/virtual/streams")
}

require("react-native-gesture-handler")
const { App } = require("./src/app/App")
export default registerRootComponent(App)
