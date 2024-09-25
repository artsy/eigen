import { modules } from "app/AppRegistry"
import { matchRoute } from "app/routes"
import { GlobalStore } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { RateLimiter } from "limiter"
import { useEffect } from "react"
import { fetchQuery, GraphQLTaggedNode } from "react-relay"
import {
  createOperationDescriptor,
  getRequest,
  OperationType,
  Variables,
  VariablesOf,
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
  const environment = getRelayEnvironment()
  const operation = createOperationDescriptor(getRequest(query), variables ?? {})

  try {
    await fetchQuery(environment, query, variables ?? {}, {
      networkCacheConfig: { force: true },
    }).toPromise()
    // this will retain the result in the relay store so it's not garbage collected.
    environment.retain(operation)
  } catch (error) {
    // We don't want to throw an error here because we don't want to block the user from navigating to the page.
    // We still want to log the error so we can investigate it.
    if (__DEV__) {
      console.log(`Prefetching query failed: ${error}`)
    }
  }
}

const prefetchUrl = async <TQuery extends OperationType>(
  url: string,
  variables?: VariablesOf<TQuery>
) => {
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
      await prefetchQuery(query, options)
    }
  } catch (error) {
    console.error(`Prefetching "${url}" failed.`, error)
  }

  if (logPrefetching) {
    console.log(`Prefetching "${url}"`)
  }
}

export const usePrefetch = () => {
  if (__TEST__) {
    return () => null
  }

  return prefetchUrl
}
