import { RecordSource as PersistRecordSource, Store as PersistStore } from "@wora/relay-store"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { useEffect } from "react"
import {
  cacheMiddleware,
  errorMiddleware as relayErrorMiddleware,
  RelayNetworkLayer,
} from "react-relay-network-modern/node8"
import { Environment, RecordSource, Store } from "relay-runtime"
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
import { RelayCache } from "./RelayCache"

const DEFAULT_CACHE_TTL = 60 * 60 * 1000 // 1 hour

// ** Creates persistant Relay store */
const createPersistantStore = () => {
  const source = new PersistRecordSource()
  const persistStore = new PersistStore(source, {}, { queryCacheExpirationTime: DEFAULT_CACHE_TTL })

  persistStore.hydrate()

  return persistStore
}

// ** Creates standard Relay store */
const createStore = () => {
  const source = new RecordSource()
  return new Store(source)
}

/// WARNING: Creates a whole new, separate Relay environment. Useful for testing.
/// Use `defaultEnvironment` for production code.
export function createEnvironment(
  networkConfig: ConstructorParameters<typeof RelayNetworkLayer> = [
    [
      // The top middlewares run first, i.e. they are the furtherst from the fetch
      cacheMiddleware(),
      persistedQueryMiddleware(),
      metaphysicsURLMiddleware(),
      rateLimitMiddleware(),
      // @ts-ignore
      errorMiddleware(),
      // We need to run the checkAuthenticationMiddleware as early as possible to make sure that the user
      // session is still valid. This is why we need to keep it as low as possible in the middlewares array.
      checkAuthenticationMiddleware(),
      metaphysicsExtensionsLoggerMiddleware(),
      simpleLoggerMiddleware(),
      __DEV__ ? relayErrorMiddleware() : null,
      timingMiddleware(),
    ],
    // `noThrow` is currently marked as "experimental" and may be deprecated in the future.
    // See: https://github.com/relay-tools/react-relay-network-modern#advanced-options-2nd-argument-after-middlewares
    { noThrow: true },
  ]
) {
  const network = new RelayNetworkLayer(...networkConfig)

  const enablePersistantCaching = unsafe_getFeatureFlag("AREnablePersistantCaching")

  const store = enablePersistantCaching ? createPersistantStore() : createStore()

  // tslint:disable-next-line:no-shadowed-variable
  const environment = new Environment({
    network,
    store,
  })

  // tslint:disable-next-line:no-shadowed-variable
  const clearRelayCaches = () => {
    RelayCache.clearAll()
    ;(store as PersistStore).purge?.()
  }

  return { environment, clearRelayCaches }
}

export let defaultEnvironment: Environment
export let clearRelayCache: () => void

export const useInitializeRelayEnvironment = () => {
  useEffect(() => {
    const { environment, clearRelayCaches } = createEnvironment()

    defaultEnvironment = environment
    clearRelayCache = clearRelayCaches
  }, [])
}
