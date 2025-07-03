import { GlobalStore, unsafe_getDevToggle } from "app/store/GlobalStore"
import { getCurrentURL } from "app/system/navigation/utils/getCurrentURL"
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
          `CDN cache will be ingore for ${req.operation.name} because you are setting force to true. Either remove @cacheable or set force to false`
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
          `CDN cache will be ignore for ${
            req.operation.name
          } because you are setting a personalized argument on a cacheable request. List of personalized arguments: ${SKIP_CACHE_ARGUMENTS.join(
            ", "
          )}`
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
      if (shouldSkipCDNCache(req as GraphQLRequest)) {
        return { "Cache-Control": "no-cache" }
      }

      if (unsafe_getDevToggle("DTCacheHitsVisialiser")) {
        GlobalStore.actions.toast.add({
          message: `${(req as GraphQLRequest).operation.name} hit cache 🚀`,
          placement: "bottom",
          options: {
            backgroundColor: "green100",
          },
        })
      }

      return {}
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
