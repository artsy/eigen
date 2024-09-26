import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { Variables } from "react-relay"

const CACHEABLE_DIRECTIVE_REGEX = /@\bcacheable\b/
export const isRequestCacheable = (req: GraphQLRequest) => {
  const queryText = req.fetchOpts.body as string

  return CACHEABLE_DIRECTIVE_REGEX.test(queryText)
}

export const hasNoCacheParamPresent = (url: string) => {
  const queryString = url?.split("?")[1]
  const urlParams = new URLSearchParams(queryString)
  const noCache = urlParams.get("nocache")
  if (noCache) {
    return true
  }

  return false
}

export const SKIP_CACHE_ARGUMENTS = ["includeArtworksByFollowedArtists", "collectionID"]
// Important - Add any new personalized argument checks to this list. That way, logged-in queries
// _without_ this argument can still be `@cacheable`, and when queries include this argument,
// those queries will not be cached.
export const hasPersonalizedArguments = (variables: Variables) => {
  // return true if variables has at least one of the SKIP_CACHE_ARGUMENTS that is truthy
  return SKIP_CACHE_ARGUMENTS.some((arg) => !!variables[arg])
}
