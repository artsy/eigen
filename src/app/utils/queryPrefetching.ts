import { modules } from "app/AppRegistry"
import { matchRoute } from "app/navigation/routes"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { RateLimiter } from "limiter"
import { useEffect } from "react"
import {
  createOperationDescriptor,
  Environment,
  fetchQuery,
  getRequest,
  GraphQLTaggedNode,
  Variables,
} from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { useTreatment } from "./useExperiments"

const DEFAULT_QUERIES_PER_INTERVAL = 60

let limiter: RateLimiter

// Initializes the rate limiter because we load parameters from Echo.
export const useInitializeQueryPrefetching = () => {
  const echoMessages = GlobalStore.useAppState((state) => state.artsyPrefs.echo.state.messages)

  useEffect(() => {
    const queriesPerInterval = Number(
      echoMessages.find((message) => message.name === "EigenQueryPrefetchingRateLimit")?.content ||
        DEFAULT_QUERIES_PER_INTERVAL
    )

    limiter = new RateLimiter({
      tokensPerInterval: queriesPerInterval,
      interval: "minute",
      fireImmediately: true,
    })
  }, [])
}

// Limit requests and don't execute when rate limit is reached.
const isRateLimited = async () => {
  const remainingRequests = await limiter.removeTokens(1)

  return remainingRequests < 0
}

const prefetchQuery = async (
  environment: Environment,
  query: GraphQLTaggedNode,
  variables: Variables = {}
) => {
  const operation = createOperationDescriptor(getRequest(query), variables)

  await fetchQuery(environment, query, variables, {
    networkCacheConfig: { force: false },
  }).toPromise()

  // this will retain the result in the relay store so it's not garbage collected.
  environment.retain(operation)
}

const prefetchUrl = async (environment: Environment, url: string, variables: Variables = {}) => {
  if (await isRateLimited()) {
    console.log("Reached prefetching rate limit.")
    return
  }

  const result = matchRoute(url)

  if (result.type !== "match") {
    return
  }

  const module = modules[result.module]

  if (module.type !== "react") {
    console.error(`Failed to prefetch ${url} (cannot prefetch ${module.type} module).`)
    return
  }

  const query = module.Query

  if (!query) {
    console.error(`Failed to prefetch "${url}" (couldn't find query).`)
    return
  }

  const options = { ...result.params, ...variables }

  console.log(`Prefetching "${url}"`)

  try {
    prefetchQuery(environment, query, options)
  } catch (error) {
    console.error(`Prefetching "${url}" failed.`, error)
  }
}

export const usePrefetch = () => {
  const enablePrefetching = useFeatureFlag("AREnableQueriesPrefetching")
  const queryPrefetchingTreatment = useTreatment("QueryPrefetching")

  if (!enablePrefetching || queryPrefetchingTreatment === "disabled" || __TEST__) {
    return () => null
  }

  return prefetchUrl.bind(this, defaultEnvironment as RelayModernEnvironment)
}

export const ˆ = (attribute: string) => (item?: any) => item && item[attribute]
