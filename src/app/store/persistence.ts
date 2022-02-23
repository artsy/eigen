import AsyncStorage from "@react-native-async-storage/async-storage"
import { State } from "easy-peasy"
import { isArray, isBoolean, isNull, isNumber, isPlainObject, isString, throttle } from "lodash"
import { Middleware } from "redux"
import { GlobalStoreModel } from "./GlobalStoreModel"
import { migrate } from "./migration"

export const SESSION_KEY = "sessionState"
export const STORAGE_KEY = "artsy-app-state"

export const LEGACY_SEARCH_STORAGE_KEY = "SEARCH/RECENT_SEARCHES"

export function sanitize(object: unknown, path: Array<string | number> = []): unknown {
  if (isPlainObject(object)) {
    const result = {} as any
    for (const key of Object.keys(object as any)) {
      // ignore computed properties, sessionState
      if (key !== SESSION_KEY && !Object.getOwnPropertyDescriptor(object, key)?.get) {
        result[key] = sanitize((object as any)[key], [...path, key])
      }
    }
    return result
  } else if (isArray(object)) {
    return object.map((elem, i) => sanitize(elem, [...path, i]))
  } else if (isNumber(object) || isString(object) || isNull(object) || isBoolean(object)) {
    return object
  } else {
    console.error(`Cannot serialize value at path ${path.join(".")}: ${object}`)
    return null
  }
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

export async function persist(globalStoreState: State<GlobalStoreModel>) {
  return await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitize(globalStoreState)))
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

export async function unpersist(): Promise<DeepPartial<State<GlobalStoreModel>>> {
  const json = await AsyncStorage.getItem(STORAGE_KEY)

  try {
    const result = (json ? migrate({ state: JSON.parse(json) }) : {}) as State<GlobalStoreModel>
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

export const persistenceMiddleware: Middleware = (store) => {
  const throttledPersist = throttle(persist, 1000, { leading: false, trailing: true })
  return (next) => (action) => {
    next(action)
    // use requestAnimationFrame to make doubly sure we avoid blocking UI updates
    requestAnimationFrame(() => {
      throttledPersist(store.getState())
    })
  }
}
