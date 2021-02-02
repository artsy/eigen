import { errorMiddleware, loggerMiddleware, RelayNetworkLayer, urlMiddleware } from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"

import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { cacheMiddleware } from "./middlewares/cacheMiddleware"
import { checkAuthenticationMiddleware } from "./middlewares/checkAuthenticationMiddleware"
import { metaphysicsExtensionsLoggerMiddleware } from "./middlewares/metaphysicsMiddleware"
import { principalFieldErrorMiddleware } from "./middlewares/principalFieldErrorMiddleware"
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware"
import { timingMiddleware } from "./middlewares/timingMiddleware"

/// WARNING: Creates a whole new, separate Relay environment. Useful for testing.
/// Use `defaultEnvironment` for production code.
export default function createEnvironment() {
  const network = new RelayNetworkLayer(
    [
      // The top middlewares run
      // @ts-ignore
      cacheMiddleware(),
      rateLimitMiddleware(),
      urlMiddleware({
        url: () => getCurrentEmissionState().metaphysicsURL,
        headers: () => {
          const { userAgent, userID, authenticationToken } = getCurrentEmissionState()
          return {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
            "X-USER-ID": userID,
            "X-ACCESS-TOKEN": authenticationToken,
            "X-TIMEZONE": LegacyNativeModules.ARCocoaConstantsModule.LocalTimeZone,
          }
        },
      }),
      // @ts-ignore
      principalFieldErrorMiddleware(),
      // We need to run the checkAuthenticationMiddleware as early as possible to make sure that the user
      // session is still valid. This is why we need to keep it as low as possible in the middlewares array.
      checkAuthenticationMiddleware(),
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
