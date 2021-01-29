import AsyncStorage from "@react-native-community/async-storage"
import { NavigationContainerRef } from "@react-navigation/native"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { useEffect } from "react"

const NAV_STATE_STORAGE_KEY = "ARDevNavState"

interface NavStateCache {
  launchCount: number
  stackStates: {
    [stackID: string]: any
  }
}

let reloadedCache: NavStateCache | null = null
const currentCache: NavStateCache = {
  launchCount: ArtsyNativeModule.launchCount,
  stackStates: {},
}

export async function loadDevNavigationStateCache() {
  if (!__DEV__) {
    return
  }
  const json = await AsyncStorage.getItem(NAV_STATE_STORAGE_KEY)
  if (json) {
    try {
      const parsedCache = JSON.parse(json)
      // only reinstate the navigation state cache for bundle reloads, not for app reboots
      if (parsedCache?.launchCount === currentCache.launchCount) {
        reloadedCache = parsedCache
      }
    } catch (e) {
      console.error("coudln't parse reloaded dev navigation state", e)
    }
  }
}

export function useReloadedDevNavigationState(
  stackID: string | undefined,
  ref: React.RefObject<NavigationContainerRef>
) {
  if (!__DEV__ || !stackID) {
    return
  }

  useEffect(() => {
    const unlisten = ref.current?.addListener("state", (e) => {
      currentCache.stackStates[stackID] = e.data.state
      AsyncStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(currentCache))
    })
    return () => {
      unlisten?.()
    }
  }, [])

  return reloadedCache?.stackStates[stackID]
}
