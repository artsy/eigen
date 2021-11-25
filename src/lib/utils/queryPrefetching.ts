import { modules } from "lib/AppRegistry"
import { matchRoute } from "lib/navigation/routes"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { RateLimiter } from "limiter"
import {
  createOperationDescriptor,
  Environment,
  fetchQuery,
  getRequest,
  GraphQLTaggedNode,
  Variables,
} from "relay-runtime"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"

const limiter = new RateLimiter({ tokensPerInterval: 60, interval: "minute", fireImmediately: true })

// Limit requests and don't execute when rate limit is reached.
const isRateLimited = async () => {
  const remainingRequests = await limiter.removeTokens(1)

  return remainingRequests < 0
}

const prefetchQuery = async (environment: Environment, query: GraphQLTaggedNode, variables: Variables = {}) => {
  const operation = createOperationDescriptor(getRequest(query), variables)

  try {
    const data = await fetchQuery(environment, query, variables)

    // this will retain the result in the relay store so it's not garbage collected.
    environment.retain(operation)

    return data
  } catch (error) {
    console.error("Prefetching failed.", error)
  }
}

const prefetchUrl = async (environment: Environment, url: string, variables: Variables = {}) => {
  if (await isRateLimited()) {
    console.log("Reached prefetching rate limit.")
    return
  }

  const result = matchRoute(url)

  if (result.type !== "match") {
    return
  }

  const module = modules[result.module]

  if (module.type !== "react") {
    console.error(`Failed to prefetch ${url} (cannot prefetch ${module.type} module).`)
    return
  }

  const query = module.Query

  if (!query) {
    console.error(`Failed to prefetch ${url} (couldn't find query).`)
    return
  }

  const options = { ...result.params, ...variables }

  console.log("Prefetching", url)
  console.count("Prefetched URLs")

  prefetchQuery(environment, query, options)
}

export const usePrefetch = () => {
  const enablePrefetching = useFeatureFlag("AREnableQueriesPrefetching")

  if (!enablePrefetching || __TEST__) {
    return () => null
  }

  return prefetchUrl.bind(this, defaultEnvironment as RelayModernEnvironment)
}
