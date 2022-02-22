import { IMutableContext } from "unleash-proxy-client"
import { getUnleashClient } from "./unleashClient"

export function updateExperimentsContext(newContext: IMutableContext) {
  const client = getUnleashClient()
  return client.updateContext(newContext)
}
