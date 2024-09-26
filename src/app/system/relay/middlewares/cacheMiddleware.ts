import { RelayCache as cache } from "app/system/relay/RelayCache"
import { MiddlewareNextFn } from "react-relay-network-modern"
import { GraphQLRequest } from "./types"

const IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST = ["ArtworkMarkAsRecentlyViewedQuery"]
/**
 * TODO:
 * Replace NewSaleLotsListRefetchQuery with SaleLotsListQuery when AREnableArtworksConnectionForAuction is released
 * or remove it when relay hooks will be used for Sale screen and cache problem for loadMore will be fixed
 *
 * Jira ticket: https://artsyproduct.atlassian.net/browse/FX-4133
 */
const IGNORE_CACHE_QUERY_ALLOWLIST = ["NewSaleLotsListRefetchQuery"]

export const cacheMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const { cacheConfig, operation, variables } = req
    const isQuery = operation.operationKind === "query"
    const isCacheIgnoredQuery = IGNORE_CACHE_QUERY_ALLOWLIST.includes(operation.name)
    const queryID = operation.id

    if (!queryID) {
      console.error("Query ID not found")
      return next(req)
    }

    // If we have valid data in cache return
    if (isQuery && !cacheConfig.force && !isCacheIgnoredQuery) {
      const dataFromCache = await cache.get(queryID, variables)
      if (dataFromCache) {
        return JSON.parse(dataFromCache)
      }
    }

    cache.set(queryID, variables, null).catch((error) => {
      console.error("Error setting cache", error)
    })

    const response = await next(req)

    const clearCache = () => {
      cache.clear(queryID, req.variables).catch((error) => {
        console.error("Error clearing cache", error)
      })
    }

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        // Don't cache responses with errors in them (GraphQL responses are always 200, even if they contain errors).
        if ((response.json as any).errors === undefined) {
          cache
            .set(
              queryID,
              req.variables,
              JSON.stringify(response.json),
              req.cacheConfig.emissionCacheTTLSeconds
            )
            .catch((error) => {
              console.error("Error setting cache", error)
            })
        } else {
          clearCache()
          return response
        }
      } else {
        // Clear the entire cache if a mutation is made (unless it's in the allowlist).
        if (!IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST.includes(req.operation.name)) {
          cache.clearAll().catch((error) => {
            console.error("Error clearing cache", error)
          })
        }
      }
      return response
    } else {
      clearCache()
      return response
    }
  }
}
