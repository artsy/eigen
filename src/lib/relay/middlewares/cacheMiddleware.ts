import { NetworkError } from "lib/utils/errors"
import { RelayQueryRequest, RelayResponsePayload } from "relay-runtime"
import * as cache from "../../NativeModules/GraphQLQueryCache"

export const cacheMiddleware = (opts = {}) => {
  return next => async (req: RelayQueryRequest) => {
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
      body = { query: require("../../../__generated__/complete.queryMap.json")[queryID], variables }
      req.operation.text = body.query
    } else {
      body = { documentID: queryID, variables }
    }

    if (body && (body.query || body.documentID)) {
      req.fetchOpts.body = JSON.stringify(body)
    }

    const response: RelayResponsePayload = await next(req)

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        cache.set(queryID, req.variables, JSON.stringify(response.json))
      } else {
        cache.clearAll()
      }
      return response
    } else {
      cache.clear(queryID, req.variables)

      const error = new NetworkError(response.statusText)
      error.response = response
      throw error
    }
  }
}
