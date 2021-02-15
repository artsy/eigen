import * as RelayCache from "lib/relay/RelayCache"
import { NativeModules, Platform } from "react-native"
const { ARGraphQLQueryCache } = NativeModules

export function set(queryID: string, variables: object, response: string, ttl: number = 0): void {
  if (Platform.OS !== "ios") {
    RelayCache.set(queryID, variables, response, ttl)
    return
  }
  ARGraphQLQueryCache._setResponseForQueryIDWithVariables(response, queryID, variables, ttl)
}

export function get(queryID: string, variables: object): Promise<string | null> {
  if (Platform.OS !== "ios") {
    return RelayCache.get(queryID, variables)
  }
  return ARGraphQLQueryCache._responseForQueryIDWithVariables(queryID, variables)
}

export function clear(queryID: string, variables: object): void {
  if (Platform.OS !== "ios") {
    RelayCache.clear(queryID, variables)
    return
  }
  ARGraphQLQueryCache._clearQueryIDWithVariables(queryID, variables)
}

export function clearAll(): void {
  if (Platform.OS !== "ios") {
    RelayCache.clearAll()
    return
  }
  ARGraphQLQueryCache._clearAll()
}
