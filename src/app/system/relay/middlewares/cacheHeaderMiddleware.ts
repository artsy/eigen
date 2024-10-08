import { getCurrentURL } from "app/routes"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import {
  hasNoCacheParamPresent,
  hasPersonalizedArguments,
  isRequestCacheable,
} from "app/system/relay/helpers/cacheHeaderMiddlewareHelpers"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { Middleware } from "react-relay-network-modern"

export const shouldSkipCDNCache = (req: GraphQLRequest) => {
  // The order of these checks is important.
  // We only want to use CDN cache if:
  // - force is false in the cacheConfig
  // - @cacheable is present on the query
  // - the query does not have any of the following arguments:
  //     - a known personalized argument is present in the query (for example `include_artworks_by_followed_artists`)
  //     - nocache param is present in the url

  if (req.cacheConfig?.force === true) {
    return true
  }

  if (isRequestCacheable(req)) {
    const url = getCurrentURL()
    if (url && hasNoCacheParamPresent(url)) {
      // Don't use CDN cache if the url has the nocache param
      return true
    }

    if (hasPersonalizedArguments(req.variables)) {
      // Don't use CDN cache if the query has a personalized argument
      return true
    }

    // Use CDN cache if none of the above conditions are met
    return false
  }

  // By default, skip CDN cache
  return true
}

export const cacheHeaderMiddleware = (): Middleware => {
  return (next) => async (req) => {
    const cacheControlHeader = (() => {
      const enableCacheableDirective = unsafe_getFeatureFlag("AREnableCacheableDirective")
      switch (true) {
        // Skip CDN cache if cacheable directive feature flag is disabled
        case !enableCacheableDirective:
        case shouldSkipCDNCache(req as GraphQLRequest): {
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
      ...cacheControlHeader,
    }

    const res = await next(req)

    return res
  }
}
