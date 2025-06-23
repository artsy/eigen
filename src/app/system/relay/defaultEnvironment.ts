import { cacheHeaderMiddleware } from "app/system/relay/middlewares/cacheHeaderMiddleware"
import { logRelay } from "app/utils/loggers"
import { Environment as IEnvironment } from "react-relay"
import {
  cacheMiddleware,
  perfMiddleware,
  errorMiddleware as relayErrorMiddleware,
  RelayNetworkLayer,
  uploadMiddleware,
} from "react-relay-network-modern"
import { Environment, RecordSource, Store } from "relay-runtime"
import RelayQueryResponseCache from "relay-runtime/lib/network/RelayQueryResponseCache"
import { MockEnvironment } from "relay-test-utils"

import { checkAuthenticationMiddleware } from "./middlewares/checkAuthenticationMiddleware"
import { errorMiddleware } from "./middlewares/errorMiddleware"
import {
  metaphysicsExtensionsLoggerMiddleware,
  metaphysicsURLMiddleware,
  persistedQueryMiddleware,
} from "./middlewares/metaphysicsMiddleware"
import { rateLimitMiddleware } from "./middlewares/rateLimitMiddleware"
import { simpleLoggerMiddleware } from "./middlewares/simpleLoggerMiddleware"
import { timingMiddleware } from "./middlewares/timingMiddleware"

export let _globalCacheRef: RelayQueryResponseCache | undefined

const network = new RelayNetworkLayer(
  [
    // middlewares use LIFO. The bottom ones in the array will run first after the fetch.
    cacheMiddleware({
      size: 500, // max 500 requests
      ttl: 900000, // 15 minutes
      clearOnMutation: true,
      onInit: (cache) => (_globalCacheRef = cache),
    }),
    persistedQueryMiddleware(),
    metaphysicsURLMiddleware(),
    rateLimitMiddleware(),
    uploadMiddleware(),
    // @ts-expect-error
    errorMiddleware(),
    metaphysicsExtensionsLoggerMiddleware(),
    cacheHeaderMiddleware(),
    simpleLoggerMiddleware(),
    __DEV__ && logRelay
      ? relayErrorMiddleware({
          disableServerMiddlewareTip: true,
          // We only use relay so no need prefix this with relay error
          prefix: " ",
          logger: cleanConsoleError,
        })
      : null,
    __DEV__ && logRelay ? perfMiddleware() : null,
    timingMiddleware(),
    checkAuthenticationMiddleware(), // KEEP AS CLOSE TO THE BOTTOM OF THIS ARRAY AS POSSIBLE. It needs to run as early as possible in the middlewares.
  ],
  {
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    noThrow: true,
  }
)
const store = new Store(new RecordSource(), { gcReleaseBufferSize: 100 })
const defaultEnvironment = new Environment({ network, store })

/**
 * If you're in a test file, make sure to use `getMockRelayEnvironment` instead.
 */
export const getRelayEnvironment = () => defaultEnvironment as IEnvironment

// We could get rid of this, if we could type `getRelayEnvironment`
// to be a func that returns `Environment` for regular code and
// to be a func that returns `MockEnvironment` for test code.
export const getMockRelayEnvironment = getRelayEnvironment as unknown as () => MockEnvironment

// special relay env, more info here: https://github.com/artsy/eigen/pull/4489
export const bottomTabsRelayEnvironment = new Environment({
  network: new RelayNetworkLayer([
    persistedQueryMiddleware(),
    metaphysicsURLMiddleware(),
    simpleLoggerMiddleware(),
  ]),
  store: new Store(new RecordSource()),
})

function cleanConsoleError(...args: any[]) {
  // Flatten and join all string-like arguments
  const message = args
    .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)))
    .join(" ")

  // Remove format specifiers like %c, %O, etc.
  const cleanedMessage = message.replace(/%[a-zA-Z]/g, "")

  console.error(cleanedMessage)
}
