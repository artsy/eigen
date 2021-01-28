import AsyncStorage from "@react-native-community/async-storage"
import { NavigationContainerRef } from "@react-navigation/native"
import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { useEffect } from "react"
import { NativeModules, Platform } from "react-native"

const NAV_STATE_STORAGE_KEY_PREFIX = "ARNavState:"

const launchCount =
  Platform.OS === "ios"
    ? ArtsyNativeModules.ARNotificationsManager.nativeState.launchCount
    : NativeModules.ArtsyNativeModule.getConstants().launchCount

export type DevReloadResult = { type: "loading" } | { type: "reloaded"; state: any } | { type: "not_reloaded" }
export function useDevReloadNavState(id: string | undefined, ref: React.RefObject<NavigationContainerRef>) {
  if (!id || !__DEV__) {
    return
  }
  useEffect(() => {
    AsyncStorage.getItem(NAV_STATE_STORAGE_KEY_PREFIX + id).then((json) => {
      try {
        if (json) {
          const { launchCount: previousLaunchCount, ...state } = JSON.parse(json)
          if (previousLaunchCount === launchCount) {
            ref.current?.resetRoot(state)
          } else {
            AsyncStorage.getAllKeys().then((ks) => {
              AsyncStorage.multiRemove(ks.filter((k) => k.startsWith(NAV_STATE_STORAGE_KEY_PREFIX)))
            })
          }
        }
      } catch (e) {
        // noop
      }
    })
  }, [])

  useEffect(() => {
    let state: any
    const unlisten = ref.current?.addListener("state", (e) => {
      state = e.data.state
      AsyncStorage.setItem(NAV_STATE_STORAGE_KEY_PREFIX + id, JSON.stringify({ ...state, launchCount }))
    })
    return () => {
      unlisten?.()
    }
  }, [])
}
