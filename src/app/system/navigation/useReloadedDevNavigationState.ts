import AsyncStorage from "@react-native-async-storage/async-storage"
import { NavigationState } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useState } from "react"

export const PREVIOUS_LAUNCH_COUNT_KEY = "previous-launch-count-key"

/*
 * This hook is used to reload the navigation state in development mode.
 * It will save the navigation state to AsyncStorage and reload it when the app is reloaded.
 */
export const useReloadedDevNavigationState = (key: string) => {
  const [isReady, setIsReady] = useState(__DEV__ ? false : true)
  const launchCount = GlobalStore.useAppState((state) => state.native.sessionState.launchCount)
  const [initialState, setInitialState] = useState()

  useEffect(() => {
    if (!__DEV__) {
      return
    }

    const restoreState = async () => {
      try {
        const previousSessionState = await AsyncStorage.getItem(key)
        const previousLauncCount = await AsyncStorage.getItem(PREVIOUS_LAUNCH_COUNT_KEY)
        const state = previousSessionState ? JSON.parse(previousSessionState) : undefined

        // If the state is undefined, we don't want to set it
        if (
          state !== undefined &&
          // only reinstate state cache for bundle reloads, not for app starts/restarts
          previousLauncCount === launchCount.toString()
        ) {
          setInitialState(state)
        }
      } finally {
        setIsReady(true)
        // Save the current launch count for the next time
        AsyncStorage.setItem(PREVIOUS_LAUNCH_COUNT_KEY, launchCount.toString())
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  const saveSession = (state: NavigationState | undefined) => {
    if (__DEV__) {
      AsyncStorage.setItem(key, JSON.stringify(state))
    }
  }

  return {
    // Double checking that this can only be false in dev
    isReady: isReady || !__DEV__,
    initialState,
    saveSession,
  }
}
