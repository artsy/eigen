// TODO: DELETE THIS FILE PLEASE

import { logRelayVerbose } from "app/utils/loggers"
import {
  loggerMiddleware,
  errorMiddleware as relayErrorMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"

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

/**
 * @deprecated Use `getRelayEnvironment()` instead.
 * DO NOT USE THIS FUNCTION. It is only exported for legacy reasons.
 */
export function createEnvironment(
  networkConfig: ConstructorParameters<typeof RelayNetworkLayer> = [
    [
      // The top middlewares run first, i.e. they are the furthest from the fetch
      // @ts-ignore
      cacheMiddleware(),
      persistedQueryMiddleware(),
      metaphysicsURLMiddleware(),
      rateLimitMiddleware(),
      uploadMiddleware(),
      // @ts-ignore
      errorMiddleware(),
      // We need to run the checkAuthenticationMiddleware as early as possible to make sure that the user
      // session is still valid. This is why we need to keep it as low as possible in the middlewares array.
      checkAuthenticationMiddleware(),
      metaphysicsExtensionsLoggerMiddleware(),
      simpleLoggerMiddleware(),
      __DEV__ && logRelayVerbose ? loggerMiddleware() : null,
      __DEV__ ? relayErrorMiddleware() : null,
      timingMiddleware(),
    ],
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    { noThrow: true },
  ]
) {
  const network = new RelayNetworkLayer(...networkConfig)
  const source = new RecordSource()
  const store = new Store(source)
  return new Environment({
    network,
    store,
  })
}

/**
 * @deprecated Use `getRelayEnvironment()` instead.
 * DO NOT USE THIS FUNCTION. It is only exported for legacy reasons.
 */
export const defaultEnvironment = createEnvironment()
