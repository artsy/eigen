import AsyncStorage from "@react-native-community/async-storage"
import { NavigationContainerRef } from "@react-navigation/native"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { useEffect } from "react"

const NAV_STATE_STORAGE_KEY = "ARDevNavState"

export const BOTTOM_NAV_STATE_STORAGE_KEY = "__dev__reloadState"

interface NavStateCache {
  launchCount: number
  stackStates: {
    [stackID: string]: any
  }
  selectedTab: BottomTabType
}

let reloadedCache: NavStateCache | null = null

const currentCache: NavStateCache = {
  launchCount: ArtsyNativeModule.launchCount,
  stackStates: {},
  selectedTab: "home",
}

export async function loadDevNavigationStateCache(switchTabAction: (tabName: BottomTabType) => void) {
  if (!__DEV__) {
    return
  }
  const json = await AsyncStorage.getItem(NAV_STATE_STORAGE_KEY)
  if (json) {
    try {
      const parsedCache = JSON.parse(json)
      // only reinstate the navigation state cache for bundle reloads, not for app reboots
      if (parsedCache?.launchCount === currentCache.launchCount) {
        switchTabAction(parsedCache.selectedTab)

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

// We want to save the selected Tab after the user switches tabs
export async function saveDevNavState(selectedTab: BottomTabType) {
  if (!__DEV__) {
    return
  }

  currentCache.selectedTab = selectedTab
  AsyncStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(currentCache))
}
