import { modules } from "app/Navigation/utils/modules"
import { GlobalStore } from "app/store/GlobalStore"
import { matchRoute } from "app/system/navigation/utils/matchRoute"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { RateLimiter } from "limiter"
import { useEffect } from "react"
import { fetchQuery, GraphQLTaggedNode } from "react-relay"
import { OperationType, Variables, VariablesOf } from "relay-runtime"
import { logPrefetching } from "./loggers"

const DEFAULT_QUERIES_PER_INTERVAL = 60

let limiter: RateLimiter

export const usePrefetch = () => {
  return prefetchRoute
}

const prefetchRoute = async <TQuery extends OperationType>(
  route: string,
  variables?: VariablesOf<TQuery>
) => {
  if (await isRateLimited()) {
    if (logPrefetching) console.log("[queryPrefetching] Rate limit reached.")
    return
  }

  const result = matchRoute(route)

  if (result.type !== "match") {
    return
  }

  const module = modules[result.module]

  const queries = module.Queries

  if (!queries) {
    if (logPrefetching)
      console.error(`[queryPrefetching] Cannot not find queries for route ${route}.`)
    return
  }

  const allVariables = { ...result.params, ...variables }

  return queries.map((query) => {
    return prefetchQuery({ query, variables: allVariables, route })
  })
}

const prefetchQuery = async ({
  query,
  variables,
  route,
}: {
  query: GraphQLTaggedNode
  variables?: Variables
  route?: string
}) => {
  const environment = getRelayEnvironment()

  return fetchQuery(environment, query, variables ?? {}, {
    fetchPolicy: "store-or-network",
    networkCacheConfig: {
      force: false,
    },
  }).subscribe({
    start: () => {
      if (logPrefetching) {
        console.log("[queryPrefetching] Starting prefetch:", route)
      }
    },
    complete: () => {
      if (logPrefetching) {
        console.log("[queryPrefetching] Completed:", route)
      }
    },
    error: () => {
      console.error("[queryPrefetching] Error prefetching:", route)
    },
  })
}

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
