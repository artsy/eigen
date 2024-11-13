import { GraphQLRequest } from "app/system/relay/middlewares/types"
import { Variables } from "react-relay"
const queryMap = require("../../../../../data/complete.queryMap.json")

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
  const urlParams = new URLSearchParams(queryString)
  const noCache = urlParams.get("nocache")
  if (noCache) {
    return true
  }

  return false
}

export const SKIP_CACHE_ARGUMENTS = ["includeArtworksByFollowedArtists", "isFollowed", "isSaved"]
// Important - Add any new personalized argument checks to this list. That way, logged-in queries
// _without_ this argument can still be `@cacheable`, and when queries include this argument,
// those queries will not be cached.
export const hasPersonalizedArguments = (variables: Variables) => {
  // return true if variables has at least one of the SKIP_CACHE_ARGUMENTS that is truthy
  return SKIP_CACHE_ARGUMENTS.some((arg) => !!variables[arg])
}

export const SKIP_CACHE_FIELDS = ["isFollowed", "isSaved"]
// Important - Add any new personalized field checks to this list. That way, logged-in queries
// _without_ this field can still be `@cacheable`, and when queries include this field,
// those queries will not be cached.
export const hasPersonalizedFields = (request: GraphQLRequest) => {
  const queryID = request.getID()
  const body = queryMap[queryID]

  // Body doesn't include any of the strings in SKIP_CACHE_FIELDS
  if ((body && body.includes("isFollowed")) || body.includes("isSaved")) {
    return true
  }

  return false
}
