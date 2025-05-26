import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationState } from "@react-navigation/native"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEffect, useState } from "react"

export const PREVIOUS_LAUNCH_COUNT_KEY = "previous-launch-count-key"

// NAV STACK KEYS
export const MODAL_NAVIGATION_STACK_STATE_KEY = "MODAL_NAVIGATION_STACK_STATE_KEY"
export const EDIT_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY =
  "EDIT_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY"
export const CREATE_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY =
  "CREATE_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY"

export const clearNavState = async () => {
  await AsyncStorage.multiRemove([
    MODAL_NAVIGATION_STACK_STATE_KEY,
    EDIT_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY,
    CREATE_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY,
  ])
}

/*
 * This hook is used to reload the navigation state in development mode.
 * It will save the navigation state to AsyncStorage and reload it when the app is reloaded.
 */
export const useReloadedDevNavigationState = (key: string) => {
  const isNavigationStateRehydrationDisabledToggle = useDevToggle(
    "DTDisableNavigationStateRehydration"
  )
  const hasChangedColorScheme = GlobalStore.useAppState(
    (state) => state.devicePrefs.sessionState.hasChangedColorScheme
  )
  const setSessionState = GlobalStore.actions.devicePrefs.setSessionState

  // We only rehydrate navigation state on dev builds and if the toggle is disabled
  const isNavigationStateRehydrationEnabled =
    (__DEV__ && !isNavigationStateRehydrationDisabledToggle) || hasChangedColorScheme

  const [isReady, setIsReady] = useState(isNavigationStateRehydrationEnabled ? false : true)
  const launchCount = ArtsyNativeModule.launchCount
  // TODO: This seems to be unreliable and return undefined in some cases
  // Look if should be removed in favor of the native module
  // const globalLaunchCount = GlobalStore.useAppState(
  //   (state) => state.native.sessionState.launchCount
  // )

  const [initialState, setInitialState] = useState()

  useEffect(() => {
    if (!isNavigationStateRehydrationEnabled) {
      return
    }

    const restoreState = async () => {
      try {
        const previousSessionState = await AsyncStorage.getItem(key)
        const previousLaunchCount = await AsyncStorage.getItem(PREVIOUS_LAUNCH_COUNT_KEY)
        const state = previousSessionState ? JSON.parse(previousSessionState) : undefined

        // If the state is undefined, we don't want to set it
        if (
          state !== undefined &&
          launchCount !== undefined &&
          // only reinstate state cache for bundle reloads, not for app starts/restarts
          previousLaunchCount === launchCount.toString()
        ) {
          setInitialState(state)
        }
      } finally {
        setIsReady(true)
        if (launchCount !== undefined) {
          // Save the current launch count for the next time
          AsyncStorage.setItem(PREVIOUS_LAUNCH_COUNT_KEY, launchCount.toString())
        }
      }
    }

    if (!isReady) {
      restoreState()
    }
    // We need to reset the hasChangedColorScheme flag to avoid accidentally rehydrating the navigation state after restart
    setSessionState({ hasChangedColorScheme: false })
  }, [isReady])

  const saveSession = (state: NavigationState | undefined) => {
    if (isNavigationStateRehydrationEnabled) {
      AsyncStorage.setItem(key, JSON.stringify(state))
    }
  }

  return {
    isReady,
    initialState,
    saveSession,
  }
}
