import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { Appearance } from "react-native"

export const useListenToThemeChange = () => {
  const { sessionState } = GlobalStore.useAppState((state) => state.devicePrefs)

  useEffect(() => {
    Appearance.addChangeListener(() => {
      // Trigger a re-render of the app to update the color scheme
      GlobalStore.actions.devicePrefs.setSessionState({
        key: sessionState.key + 1,
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
