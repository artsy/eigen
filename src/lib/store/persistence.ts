import AsyncStorage from "@react-native-community/async-storage"
import { State } from "easy-peasy"
import { isArray, isPlainObject, mapValues, omit, throttle } from "lodash"
import { Middleware } from "redux"
import { AppStoreModel } from "./AppStoreModel"
import { migrate } from "./migration"

export const SESSION_KEY = "sessionState"
export const STORAGE_KEY = "artsy-app-state"

export const LEGACY_SEARCH_STORAGE_KEY = "SEARCH/RECENT_SEARCHES"

export function omitDeep(object: any, key: string): object {
  return mapValues(omit(object, key), val =>
    isPlainObject(val) ? omitDeep(val, key) : isArray(val) ? val.map(elem => omitDeep(elem, key)) : val
  )
}

export function assignDeep(object: any, otherObject: any) {
  for (const k of Object.keys(otherObject)) {
    if (!(k in object) || !(isPlainObject(object[k]) && isPlainObject(otherObject[k]))) {
      object[k] = otherObject[k]
    } else {
      assignDeep(object[k], otherObject[k])
    }
  }
}

export async function persist(appStoreState: State<AppStoreModel>) {
  const sanitized = omitDeep(appStoreState, SESSION_KEY)
  return await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
}

async function loadLegacySearchState() {
  const json = await AsyncStorage.getItem(LEGACY_SEARCH_STORAGE_KEY)

  if (json) {
    await AsyncStorage.removeItem(LEGACY_SEARCH_STORAGE_KEY)

    try {
      const result = JSON.parse(json)
      if (Array.isArray(result)) {
        return result
      }
    } catch (e) {
      // noop
    }
  }

  return null
}

export async function unpersist(): Promise<DeepPartial<State<AppStoreModel>>> {
  const json = await AsyncStorage.getItem(STORAGE_KEY)

  try {
    const result = (json ? migrate({ state: JSON.parse(json) }) : {}) as State<AppStoreModel>
    const recentSearches = await loadLegacySearchState()
    if (recentSearches) {
      result.search = {
        ...result.search,
        recentSearches,
      }
    }
    return result
  } catch (e) {
    if (!__TEST__) {
      console.error(e)
    }
    return {}
  }
}

export const persistenceMiddleware: Middleware = store => {
  const throttledPersist = throttle(persist, 1000, { leading: false, trailing: true })
  return next => action => {
    next(action)
    // use requestAnimationFrame to make doubly sure we avoid blocking UI updates
    requestAnimationFrame(() => {
      throttledPersist(store.getState())
    })
  }
}
