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
  route?: string | null,
  extraVariables?: VariablesOf<TQuery>,
  onComplete?: () => void
) => {
  if (!route) return null

  if (await isRateLimited()) {
    if (logPrefetching) console.log("[queryPrefetching] Rate limit reached.")
    return
  }

  const result = matchRoute(route)

  if (result.type !== "match") {
    return
  }

  const module = modules[result.module]

  const queries = module.queries

  if (!queries) {
    if (logPrefetching)
      console.warn(
        `[queryPrefetching] can not prefetch ${route} because no matching queries were found. Did you forget to add "queries" to routes.tsx?`
      )

    return
  }

  return queries.map((query, index) => {
    const variables = (() => {
      const prepareVariables = module.prepareVariables?.[index]

      if (!prepareVariables) {
        return result.params
      }

      return prepareVariables(result.params)
    })()

    return prefetchQuery({
      query,
      variables: { ...variables, ...extraVariables },
      route,
      onComplete,
    })
  })
}

export const prefetchQuery = async <T extends Variables>({
  query,
  variables,
  route,
  onComplete,
}: {
  query: GraphQLTaggedNode
  variables?: T
  route?: string
  onComplete?: () => void
}) => {
  const environment = getRelayEnvironment()

  return fetchQuery(environment, query, variables ?? {}, {
    fetchPolicy: "store-or-network",
    networkCacheConfig: {
      force: false,
    },
  }).subscribe({
    complete: () => {
      if (logPrefetching) {
        console.log("[queryPrefetching] Completed prefetching", route, {
          variables,
        })
      }

      if (onComplete) {
        onComplete()
      }
    },
    error: () => {
      console.error("[queryPrefetching] Error prefetching", route, { variables })
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
