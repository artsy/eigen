import { request } from "../metaphysics"
import * as cache from "../NativeModules/GraphQLQueryCache"

import { FetchFunction } from "relay-runtime"

export const fetchQuery: FetchFunction = (operation, variables, cacheConfig, _uploadables) => {
  const isQuery = operation.operationKind === "query"
  const queryID = operation.id

  if (isQuery && !cacheConfig.force) {
    return cache.get(queryID, variables).then(fromCache => {
      if (fromCache) {
        return JSON.parse(fromCache)
      }
      return _fetchQuery(queryID, variables, isQuery)
    })
  } else {
    return _fetchQuery(queryID, variables, isQuery)
  }
}

function _fetchQuery(queryID: string, variables: object, isQuery: boolean) {
  // Mark queryID as in-flight
  cache.set(queryID, variables, null)

  let body
  if (__DEV__) {
    body = { query: require("../../__generated__/complete.queryMap.json")[queryID], variables }
  } else {
    body = { documentID: queryID, variables }
  }

  return request(body)
    .then(response => response.text())
    .then(responseBody => {
      const json: { errors: any[] } = JSON.parse(responseBody)
      if (json.errors) {
        // Unmark as in-flight
        cache.clear(queryID, variables)
        // Log to console/Sentry
        json.errors.forEach(console.error)
        // Throw here so that our error view gets shown.
        // See https://github.com/facebook/relay/issues/1913
        throw new Error("Server-side error occurred")
      }
      if (isQuery) {
        // Fullfil in-flight request
        cache.set(queryID, variables, responseBody)
      } else if (!isQuery) {
        // In case of a mutation clear all.
        cache.clearAll()
      }
      return json
    })
}
