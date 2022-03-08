import { throttle } from "lodash"
import { IMutableContext } from "unleash-proxy-client"
import { getUnleashClient } from "./unleashClient"

export function updateExperimentsContext(newContext: IMutableContext) {
  const client = getUnleashClient()
  return client.updateContext(newContext)
}

// this might get called multiple times in a row because of ios having many providers but one client.
// we will make sure to throttle it.
export const forceFetchToggles = throttle(unthrottledForceFetch, 2000, { trailing: false })
function unthrottledForceFetch(unleashEnv: "production" | "staging") {
  const client = getUnleashClient(unleashEnv)
  client.start()
}
