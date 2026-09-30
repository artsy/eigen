import { useFocusEffect } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback } from "react"
import { StatusBar, StatusBarStyle } from "react-native"

export const useCityGuideMapStatusBar = (isMapView: boolean, listBarStyle?: StatusBarStyle) => {
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  useFocusEffect(
    useCallback(() => {
      const barStyle = isMapView ? "dark-content" : listBarStyle
      if (!barStyle) return

      const frame = requestAnimationFrame(() => StatusBar.setBarStyle(barStyle, true))

      return () => {
        cancelAnimationFrame(frame)
        StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content", true)
      }
    }, [isMapView, listBarStyle, theme])
  )
}
