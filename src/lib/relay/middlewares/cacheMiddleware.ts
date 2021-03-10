import { Platform } from "react-native"
import { MiddlewareNextFn } from "react-relay-network-modern/node8"
import * as cache from "../../NativeModules/GraphQLQueryCache"
import { GraphQLRequest } from "./types"

const IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST = ["ArtworkMarkAsRecentlyViewedQuery"]

export const cacheMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    if (__TEST__) {
      return next(req)
    }
    const { cacheConfig, operation, variables } = req
    const isQuery = operation.operationKind === "query"
    const queryID = operation.id

    // If we have valid data in cache return
    if (isQuery && !cacheConfig.force) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const dataFromCache = await cache.get(queryID, variables)
      if (dataFromCache) {
        return JSON.parse(dataFromCache)
      }
    }

    if (Platform.OS === "ios") {
      // TODO: figure out if we can remove this branch
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      cache.set(queryID, variables, null)
    } else {
      cache.clear(queryID!, variables)
    }

    const response = await next(req)

    const clearCache = () => {
      cache.clear(queryID!, req.variables)
    }

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        // Don't cache responses with errors in them (GraphQL responses are always 200, even if they contain errors).
        if ((response.json as any).errors === undefined) {
          cache.set(queryID!, req.variables, JSON.stringify(response.json), req.cacheConfig.emissionCacheTTLSeconds)
        } else {
          clearCache()
          return response
        }
      } else {
        // Clear the entire cache if a mutation is made (unless it's in the allowlist).
        if (!IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST.includes(req.operation.name)) {
          cache.clearAll()
        }
      }
      return response
    } else {
      clearCache()
      return response
    }
  }
}
