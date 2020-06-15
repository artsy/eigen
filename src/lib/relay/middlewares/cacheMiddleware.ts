import { captureMessage } from "@sentry/react-native"
import { Middleware, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import * as cache from "../../NativeModules/GraphQLQueryCache"
import { isRelayRequest } from "./util"

const IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST = ["ArtworkMarkAsRecentlyViewedQuery"]

export const cacheMiddleware = (): Middleware => {
  return next => async req => {
    if (!isRelayRequest(req)) {
      return next(req)
    }

    const { cacheConfig, operation, variables } = req

    const isQuery = operation.operationKind === "query"
    const queryID = req.id

    // If we have valid data in cache return
    if (isQuery && !cacheConfig.force) {
      const dataFromCache = await cache.get(queryID, variables)
      if (dataFromCache) {
        return JSON.parse(dataFromCache)
      }
    }

    cache.set(queryID, variables, null)

    // Get query body either from local queryMap or
    // send queryID to metaphysics
    let body: { variables?: object; query?: string; documentID?: string } = {}
    if (__DEV__) {
      body = { query: require("../../../../data/complete.queryMap.json")[queryID], variables }
      req.operation.text = body.query ?? null
    } else {
      body = { documentID: queryID, variables }
    }

    if (body && (body.query || body.documentID)) {
      req.fetchOpts.body = JSON.stringify(body)
    }

    let response: RelayNetworkLayerResponse
    try {
      response = await next(req)
    } catch (e) {
      if (!__DEV__ && e.toString().includes("Unable to serve persisted query with ID")) {
        // this should not happen normally, but let's try again with full query text to avoid ruining the user's day?
        captureMessage(e.stack)
        body = { query: require("../../../../data/complete.queryMap.json")[queryID], variables }
        req.fetchOpts.body = JSON.stringify(body)
        response = await next(req)
      } else {
        throw e
      }
    }

    const clearCache = () => {
      cache.clear(queryID, req.variables)
    }

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        // Don't cache responses with errors in them (GraphQL responses are always 200, even if they contain errors).
        if (response.errors === undefined) {
          // @ts-ignore
          // TODO: This value should probably be set through `cacheConfig.metadata`
          // Most of the time `emissionCacheTTLSeconds` will be `undefined`
          cache.set(queryID, req.variables, JSON.stringify(response.json), req.cacheConfig.emissionCacheTTLSeconds)
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
