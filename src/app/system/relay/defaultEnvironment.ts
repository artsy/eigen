import { Environment as IEnvironment } from "react-relay"
import {
  errorMiddleware as relayErrorMiddleware,
  RelayNetworkLayer,
  uploadMiddleware,
} from "react-relay-network-modern"
import { Environment, RecordSource, Store } from "relay-runtime"
import { MockEnvironment } from "relay-test-utils"

import { cacheMiddleware } from "./middlewares/cacheMiddleware"
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

const network = new RelayNetworkLayer(
  [
    // middlewares use LIFO. The bottom ones in the array will run first after the fetch.
    // @ts-expect-error
    cacheMiddleware(),
    persistedQueryMiddleware(),
    metaphysicsURLMiddleware(),
    rateLimitMiddleware(),
    uploadMiddleware(),
    // @ts-expect-error
    errorMiddleware(),
    metaphysicsExtensionsLoggerMiddleware(),
    simpleLoggerMiddleware(),
    __DEV__ ? relayErrorMiddleware() : null,
    timingMiddleware(),
    checkAuthenticationMiddleware(), // KEEP AS CLOSE TO THE BOTTOM OF THIS ARRAY AS POSSIBLE. It needs to run as early as possible in the middlewares.
  ],
  {
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    noThrow: true,
  }
)
const store = new Store(new RecordSource())
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
