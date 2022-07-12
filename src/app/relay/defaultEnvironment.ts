import {
  errorMiddleware as relayErrorMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"
import { createMockEnvironment, RelayMockEnvironment } from "relay-test-utils"

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
import { uploadMiddleware } from "./middlewares/uploadMiddleware"

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

// Used for tests
let mockEnvironment = createMockEnvironment()
export const resetMockEnvironment = () => {
  mockEnvironment = createMockEnvironment()
}

export const getRelayEnvironment = (): RelayMockEnvironment =>
  __TEST__ ? mockEnvironment : defaultEnvironment

