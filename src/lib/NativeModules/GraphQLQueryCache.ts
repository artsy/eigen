import { NativeModules } from "react-native"
const { ARGraphQLQueryCache } = NativeModules

/**
 * @param ttl Value `0` is equivalent to the default of `3600`
 */
export function set(queryID: string, variables: object, response: string | null, ttl: number = 0): void {
  ARGraphQLQueryCache._setResponseForQueryIDWithVariables(response, queryID, variables, ttl)
}

export function get(queryID: string, variables: object): Promise<string | null> {
  return ARGraphQLQueryCache._responseForQueryIDWithVariables(queryID, variables)
}

export function clear(queryID: string, variables: object): void {
  ARGraphQLQueryCache._clearQueryIDWithVariables(queryID, variables)
}

export function clearAll(): void {
  ARGraphQLQueryCache._clearAll()
}
