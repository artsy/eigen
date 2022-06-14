import { modules } from "app/AppRegistry"
import { matchRoute } from "app/navigation/routes"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { RateLimiter } from "limiter"
import { useEffect } from "react"
import {
  createOperationDescriptor,
  fetchQuery,
  getRequest,
  GraphQLTaggedNode,
  Variables,
} from "relay-runtime"
import { logPrefetching } from "./loggers"

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
async function isRateLimited() {
  const remainingRequests = await limiter.removeTokens(1)

  return remainingRequests < 0
}

const prefetchQuery = async (query: GraphQLTaggedNode, variables?: Variables) => {
  const environment = defaultEnvironment
  const operation = createOperationDescriptor(getRequest(query), variables ?? {})

  await fetchQuery(environment, query, variables ?? {}, {
    networkCacheConfig: { force: false },
  }).toPromise()

  // this will retain the result in the relay store so it's not garbage collected.
  environment.retain(operation)
}

const prefetchUrl = async (url: string, variables?: Variables) => {
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

  const queries = module.Queries

  if (!queries) {
    console.error(`Failed to prefetch "${url}" (couldn't find queries).`)
    return
  }

  const options = { ...result.params, ...variables }

  try {
    for (const query of queries) {
      prefetchQuery(query, options)
    }
  } catch (error) {
    console.error(`Prefetching "${url}" failed.`, error)
  }

  if (logPrefetching) {
    console.log(`Prefetching "${url}"`)
  }
}

export const usePrefetch = () => {
  const enablePrefetching = useFeatureFlag("AREnableQueriesPrefetching")

  if (!enablePrefetching || __TEST__) {
    return () => null
  }

  return prefetchUrl
}
