import { getCurrentURL } from "app/routes"
import {
  hasNoCacheParamPresent,
  hasPersonalizedArguments,
  isRequestCacheable,
} from "app/system/relay/helpers/cacheHeaderMiddlewareHelpers"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { Middleware } from "react-relay-network-modern"

export const RELAY_CACHE_CONFIG_HEADER_KEY = "x-relay-cache-config"
export const RELAY_CACHE_PATH_HEADER_KEY = "x-relay-cache-path"

export const shouldSkipCDNCache = (req: GraphQLRequest, url: string | undefined) => {
  // The order of these checks is important.
  // We always want to skip the cache no matter what if any of:
  //   - a known personalized argument is present in the query
  //     - `include_artworks_by_followed_artists` is a known one

  if (hasPersonalizedArguments(req.variables)) {
    return true
  }

  if (url && hasNoCacheParamPresent(url)) {
    return true
  }

  if (isRequestCacheable(req)) {
    // Then, we want to cache if the request is cacheable (based on the opt-in `@cacheable` directive).
    return false
  }

  // By default, we don't want to use cache for logged in users.
  return true
}

export const cacheHeaderMiddleware = (): Middleware => {
  return (next) => async (req) => {
    const url = getCurrentURL()

    const cacheHeaders = {
      [RELAY_CACHE_CONFIG_HEADER_KEY]: JSON.stringify((req as GraphQLRequest).cacheConfig),
      ...(url ? { RELAY_CACHE_PATH_HEADER_KEY: url } : {}),
    }

    const cacheControlHeader = (() => {
      switch (true) {
        case shouldSkipCDNCache(req as GraphQLRequest, url): {
          return { "Cache-Control": "no-cache" }
        }

        default: {
          return {}
        }
      }
    })()

    // @ts-expect-error
    req.fetchOpts.headers = {
      ...req.fetchOpts.headers,
      ...cacheHeaders,
      ...cacheControlHeader,
    }

    const res = await next(req)

    return res
  }
}
