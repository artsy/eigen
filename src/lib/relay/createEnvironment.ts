import { NativeModules } from "react-native"
import { errorMiddleware, loggerMiddleware, RelayNetworkLayer, urlMiddleware } from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"

import { metaphysicsURL } from "./config"
import { cacheMiddleware } from "./middlewares/cacheMiddleware"
import { metaphysicsExtensionsLoggerMiddleware } from "./middlewares/metaphysicsMiddleware"
import { principalFieldErrorMiddleware } from "./middlewares/principalFieldErrorMiddleware"
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware"
import { timingMiddleware } from "./middlewares/timingMiddleware"

const Emission = NativeModules.Emission
const Constants = NativeModules.ARCocoaConstantsModule

/// WARNING: Creates a whole new, separate Relay environment. Useful for testing.
/// Use `defaultEnvironment` for production code.
export default function createEnvironment() {
  const network = new RelayNetworkLayer(
    [
      // @ts-ignore
      cacheMiddleware(),
      rateLimitMiddleware(),
      urlMiddleware({
        url: metaphysicsURL,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": Emission.userAgent,
          "X-USER-ID": Emission.userID,
          "X-ACCESS-TOKEN": Emission.authenticationToken,
          "X-TIMEZONE": Constants.LocalTimeZone,
        },
      }),
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
