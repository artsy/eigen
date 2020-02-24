import { NativeModules } from "react-native"
const { ARGraphQLQueryCache } = NativeModules

export function set(queryID: string, variables: object, response: string, ttl: number = 0): void {
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
