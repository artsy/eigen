import { NetworkError } from "lib/utils/errors"
import * as cache from "../../NativeModules/GraphQLQueryCache"

export const cacheMiddleware = () => {
  return next => async req => {
    const { cacheConfig, operation, variables } = req
    const isQuery = operation.operationKind === "query"
    const queryID = operation.id

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
    let body: { variables?: object; query?: object; documentID?: string } = {}
    if (__DEV__) {
      body = { query: require("../../../../data/complete.queryMap.json")[queryID], variables }
      req.operation.text = body.query
    } else {
      body = { documentID: queryID, variables }
    }

    if (body && (body.query || body.documentID)) {
      req.fetchOpts.body = JSON.stringify(body)
    }

    const response = await next(req)

    const clearCacheAndThrowError = () => {
      cache.clear(queryID, req.variables)

      const error = new NetworkError(response.statusText)
      error.response = response
      throw error
    }

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        // Don't cache responses with errors in them (GraphQL responses are always 200, even if they contain errors).
        if (response.json.errors === undefined) {
          cache.set(queryID, req.variables, JSON.stringify(response.json), req.cacheConfig.emissionCacheTTLSeconds)
        } else {
          clearCacheAndThrowError()
        }
      } else {
        cache.clearAll()
      }
      return response
    } else {
      clearCacheAndThrowError()
    }
  }
}
