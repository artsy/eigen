import AsyncStorage from "@react-native-community/async-storage"
import { NavigationContainerProps, NavigationContainerRef } from "@react-navigation/native"
import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { useEffect, useState } from "react"
import { NativeModules, Platform } from "react-native"

const NAV_STATE_STORAGE_KEY_PREFIX = "ARNavState:"

const launchCount =
  Platform.OS === "ios"
    ? ArtsyNativeModules.ARNotificationsManager.nativeState.launchCount
    : NativeModules.ArtsyNativeModule.getConstants().launchCount

export type DevReloadResult = { type: "loading" } | { type: "reloaded"; state: any } | { type: "not_reloaded" }
export function useDevReloadNavState(
  id: string | undefined,
  ref: React.RefObject<NavigationContainerRef>
): null | { initialState: undefined | NavigationContainerProps["initialState"] } {
  if (!id || !__DEV__) {
    return { initialState: undefined }
  }
  const [result, setResult] = useState<DevReloadResult>({ type: "loading" })
  useEffect(() => {
    AsyncStorage.getItem(NAV_STATE_STORAGE_KEY_PREFIX + id).then((json) => {
      try {
        if (json) {
          const { launchCount: previousLaunchCount, ...state } = JSON.parse(json)
          if (previousLaunchCount === launchCount) {
            setResult({ type: "reloaded", state })
          } else {
            setResult({ type: "not_reloaded" })
          }
          return
        }
      } catch (e) {
        // noop
      }
      setResult({ type: "not_reloaded" })
    })
  }, [])

  const hasLoaded = result.type !== "loading"

  useEffect(() => {
    if (hasLoaded) {
      // this should only run once immediately after the navigator has mounted
      let state: any
      const unlisten = ref.current?.addListener("state", (e) => {
        state = e.data.state
        AsyncStorage.setItem(NAV_STATE_STORAGE_KEY_PREFIX + id, JSON.stringify({ ...state, launchCount }))
      })
      return () => {
        unlisten?.()
      }
    }
  }, [hasLoaded])

  if (result.type === "loading") {
    return null
  }
  if (result.type === "reloaded") {
    return { initialState: result.state }
  }
  return { initialState: undefined }
}
