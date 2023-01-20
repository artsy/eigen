import AsyncStorage from "@react-native-async-storage/async-storage"
import _ from "lodash"

const CACHE_KEY_PREFIX = "RelayCache:"

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

function cacheKey(queryID: string, variables: object) {
  return CACHE_KEY_PREFIX + requestFingerprint(queryID, variables)
}

interface CacheRecord {
  response: string | null
  expires: number
}

export async function set(
  queryID: string,
  variables: object,
  response: string | null,
  ttlSeconds: number = 0
) {
  if (ttlSeconds === 0) {
    // default should be one day according to objc code
    ttlSeconds = 60 * 60 * 24
  }
  const record: CacheRecord = { response, expires: Date.now() + ttlSeconds * 1000 }
  await AsyncStorage.setItem(cacheKey(queryID, variables), JSON.stringify(record))
}

export async function get(queryID: string, variables: object): Promise<string | null> {
  const result = await AsyncStorage.getItem(cacheKey(queryID, variables))
  if (!result) {
    return null
  }

  try {
    const record = JSON.parse(result) as CacheRecord
    if (record.expires < Date.now()) {
      await clear(queryID, variables)
      return null
    }
    return record.response
  } catch (_) {
    return null
  }
}

export async function clear(queryID: string, variables: object) {
  await AsyncStorage.removeItem(cacheKey(queryID, variables))
}

export async function clearAll() {
  const ks = await AsyncStorage.getAllKeys()
  const cacheKeys = ks.filter((k) => k.startsWith(CACHE_KEY_PREFIX))
  await AsyncStorage.multiRemove(cacheKeys)
}

export const RelayCache = {
  clearAll,
  clear,
  get,
  set,
}
