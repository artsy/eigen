import { NativeModules } from "react-native"
import { errorMiddleware, loggerMiddleware, RelayNetworkLayer, urlMiddleware } from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"

import { getCurrentEmissionState } from "lib/store/AppStore"
import { cacheMiddleware } from "./middlewares/cacheMiddleware"
import { metaphysicsExtensionsLoggerMiddleware } from "./middlewares/metaphysicsMiddleware"
import { principalFieldErrorMiddleware } from "./middlewares/principalFieldErrorMiddleware"
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware"
import { timingMiddleware } from "./middlewares/timingMiddleware"

const Constants = NativeModules.ARCocoaConstantsModule

/// WARNING: Creates a whole new, separate Relay environment. Useful for testing.
/// Use `defaultEnvironment` for production code.
export default function createEnvironment() {
  const { metaphysicsURL, userAgent, userID, authenticationToken } = getCurrentEmissionState()
  const network = new RelayNetworkLayer(
    [
      // @ts-ignore
      cacheMiddleware(),
      rateLimitMiddleware(),
      urlMiddleware({
        url: metaphysicsURL,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent,
          "X-USER-ID": userID,
          "X-ACCESS-TOKEN": authenticationToken,
          "X-TIMEZONE": Constants.LocalTimeZone,
        },
      }),
      // @ts-ignore
      principalFieldErrorMiddleware(),
      loggerMiddleware(),
      errorMiddleware({
        disableServerMiddlewareTip: true,
      }),
      metaphysicsExtensionsLoggerMiddleware(),
      timingMiddleware(),
    ],
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    { noThrow: true }
  )

  const source = new RecordSource()
  const store = new Store(source)
  return new Environment({
    network,
    store,
  })
}

export const defaultEnvironment = createEnvironment()
