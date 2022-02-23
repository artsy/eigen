import { useEffect, useRef } from "react"
import { AppState, AppStateStatus } from "react-native"

export interface AppStateProps {
  onChange?: (status: AppStateStatus) => void
  onForeground?: () => void
  onBackground?: () => void
}

export default function useAppState({ onForeground, onBackground }: AppStateProps) {
  /**
   * App States
   * active - The app is running in the foreground
   * background - The app is running in the background. The user is either in another app or on the home screen
   * inactive [iOS] - This is a transition state that currently never happens for typical React Native apps.
   */
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
      // App has come to the foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        onForeground
      ) {
        onForeground()
      }

      // App has come to the background
      if (appState.current.match(/active/) && nextAppState === "background" && onBackground) {
        onBackground()
      }

      appState.current = nextAppState
    }

    AppState.addEventListener("change", _handleAppStateChange)

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange)
    }
  }, [appState.current, onForeground, onBackground])

  return { appState: appState.current }
}
