import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { parse as parseQueryString } from "query-string"
import { Variables } from "react-relay"

export const CACHEABLE_DIRECTIVE_REGEX = /@\bcacheable\b/
export const CACHEABLE_ARGUMENT_REGEX = /"cacheable":true/

export const isRequestCacheable = (req: GraphQLRequest) => {
  const queryText = req.fetchOpts.body as string

  // Query is a persisted query
  if (queryText.startsWith('{"documentID"')) {
    return CACHEABLE_ARGUMENT_REGEX.test(queryText)
  }

  return CACHEABLE_DIRECTIVE_REGEX.test(queryText)
}

export const hasNoCacheParamPresent = (url: string) => {
  const queryString = url?.split("?")[1]
  if (!queryString) {
    return false
  }

  const params = parseQueryString(queryString)
  console.log("[debug] queryString", queryString, params)
  console.log("[debug] params.nocache", params.nocache)
  return !!params.nocache
}

export const SKIP_CACHE_ARGUMENTS = ["includeArtworksByFollowedArtists", "isFollowed", "isSaved"]
// Important - Add any new personalized argument checks to this list. That way, logged-in queries
// _without_ this argument can still be `@cacheable`, and when queries include this argument,
// those queries will not be cached.
export const hasPersonalizedArguments = (variables: Variables) => {
  // return true if variables has at least one of the SKIP_CACHE_ARGUMENTS that is truthy
  return SKIP_CACHE_ARGUMENTS.some((arg) => !!variables[arg])
}
