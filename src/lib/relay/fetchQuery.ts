import { metaphysics } from "../metaphysics"

import { FetchFunction } from "relay-runtime"
import RelayQueryResponseCache from "relay-runtime/lib/RelayQueryResponseCache"

/**
 * Cache requests/responses for 2 minutes, which is the average session time people spend in the app in recent versions.
 *
 * @see https://artsy.looker.com/sql/mj6pnhjdsxfhqv
 */
const cache = new RelayQueryResponseCache({ size: 250, ttl: 2 * 60 * 1000 })

export const fetchQuery: FetchFunction = (operation, variables, cacheConfig, _uploadables) => {
  const text = operation.text
  const isQuery = operation.operationKind === "query"

  if (isQuery && !cacheConfig.force) {
    const fromCache = cache.get(text, variables)
    if (fromCache) {
      return fromCache
    }
  }

  return metaphysics({ query: text, variables }).then(json => {
    if (json && isQuery) {
      cache.set(text, variables, json)
    } else if (!isQuery) {
      cache.clear()
    }
    return json
  })
}
