import query, { metaphysics } from "../metaphysics"

import { FetchFunction } from "relay-runtime"
import RelayQueryResponseCache from "relay-runtime/lib/RelayQueryResponseCache"

/**
 * Cache requests/responses for 2 minutes, which is the average session time people spend in the app in recent versions.
 *
 * @see https://artsy.looker.com/sql/mj6pnhjdsxfhqv
 */
const cache = new RelayQueryResponseCache({ size: 250, ttl: 2 * 60 * 1000 })

// TODO: Look on disk for cached data
class Cache {
  _responseCache: RelayQueryResponseCache

  constructor() {
    this._responseCache = new RelayQueryResponseCache({ size: 250, ttl: 2 * 60 * 1000 })
  }

  get(text, variables) {
    this._responseCache.get(text, variables)
  }

  set(text, variables, json) {
    this._responseCache.set(text, variables, json)
  }

  clear() {
    this._responseCache.clear()
  }
}

export const fetchQuery: FetchFunction = (operation, variables, cacheConfig, _uploadables) => {
  const isQuery = operation.operationKind === "query"
  let queryOrID
  let body

  if (__DEV__) {
    queryOrID = require("../../__generated__/complete.queryMap.json")[operation.id]
    body = { query: queryOrID, variables }
  } else {
    queryOrID = operation.id
    body = { documentID: queryOrID, variables }
  }

  if (isQuery && !cacheConfig.force) {
    const fromCache = cache.get(queryOrID, variables)
    if (fromCache) {
      return fromCache
    }
  }

  return metaphysics(body).then(json => {
    if (json && isQuery) {
      cache.set(queryOrID, variables, json)
    } else if (!isQuery) {
      cache.clear()
    }
    return json
  })
}
