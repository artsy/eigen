import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationContainerRef } from "@react-navigation/native"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { useEffect } from "react"

const NAV_STATE_STORAGE_KEY = "ARDevNavState"

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

// On dev mode, if the app restarted because of a bundle reload/fast refresh,
// We want to rehydrate the navigation state
export async function loadDevNavigationStateCache(
  switchTabAction: (tabName: BottomTabType) => void
) {
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

// We want the navigation stack state to persist across dev reloads
// So whenever we find out it changed, we save it
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

// We want the selected tab state to persist across dev reloads
// So we save it whenever the user switches tabs
export async function saveDevNavigationStateSelectedTab(selectedTab: BottomTabType) {
  if (!__DEV__) {
    return
  }

  currentCache.selectedTab = selectedTab
  AsyncStorage.setItem(NAV_STATE_STORAGE_KEY, JSON.stringify(currentCache))
}
