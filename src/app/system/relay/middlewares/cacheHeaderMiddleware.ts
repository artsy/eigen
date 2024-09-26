import { getCurrentURL } from "app/routes"
import {
  hasNoCacheParamPresent,
  hasPersonalizedArguments,
  isRequestCacheable,
  SKIP_CACHE_ARGUMENTS,
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

  if (isRequestCacheable(req)) {
    if (req.cacheConfig?.force === true) {
      if (__DEV__) {
        console.warn(
          "You are setting force: true on a cacheable request, CDN cache will be ignored."
        )
      }
      return true
    }

    const url = getCurrentURL()
    if (url && hasNoCacheParamPresent(url)) {
      if (__DEV__) {
        console.warn(
          "You are setting nocache param in the url on a cacheable request, CDN cache will be ignored."
        )
      }
      // Don't use CDN cache if the url has the nocache param
      return true
    }

    if (hasPersonalizedArguments(req.variables)) {
      if (__DEV__) {
        console.warn(
          "You are setting a personalized argument on a cacheable request, CDN cache will be ignored.\nList of personalized arguments: ",
          SKIP_CACHE_ARGUMENTS.join(", ")
        )
      }
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
      switch (true) {
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
