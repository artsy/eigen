import _ from "lodash"
import { NativeModules } from "react-native"
let { ARGraphQLQueryCache } = NativeModules

function stableSerialize(val: any): string {
  if (_.isPlainObject(val)) {
    return `{${Object.keys(val as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableSerialize(val[k])}`)
      .join(",")}}`
  } else if (_.isArray(val)) {
    return `[${val.map(stableSerialize).join(",")}]`
  } else {
    return JSON.stringify(val)
  }
}

export function requestFingerprint(queryID: string, variables: object) {
  return stableSerialize({ [queryID]: variables })
}

if (!ARGraphQLQueryCache) {
  let cache: {
    [requestFingerprint: string]: {
      response: string
      expires: number
    }
  } = {}
  ARGraphQLQueryCache = {
    _setResponseForQueryIDWithVariables(response: string, queryID: string, variables: object, ttl: number) {
      if (ttl === 0) {
        // default should be one day according to objc code
        ttl = 60 * 60 * 24
      }
      cache[requestFingerprint(queryID, variables)] = { response, expires: Date.now() + ttl * 1000 }
    },
    _responseForQueryIDWithVariables(queryID: string, variables: object) {
      const result = cache[requestFingerprint(queryID, variables)]
      if (result && result.expires < Date.now()) {
        return null
      }
      return Promise.resolve(result?.response ?? null)
    },
    _clearQueryIDWithVariables(queryID: string, variables: object) {
      delete cache[requestFingerprint(queryID, variables)]
    },
    _clearAll() {
      cache = {}
    },
  }
}

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
