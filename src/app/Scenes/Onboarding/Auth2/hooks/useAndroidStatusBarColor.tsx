import { useNavigation } from "@react-navigation/native"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { useEffect } from "react"
import { Platform } from "react-native"

export const useAndroidStatusBarColor = () => {
  const navigation = useNavigation()

  useEffect(() => {
    if (Platform.OS === "ios") {
      return
    }

    const unsubscribeBlur = navigation.addListener("blur", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
        ArtsyNativeModule.setAppLightContrast(false)
      })
    })

    const unsubscribeFocus = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        ArtsyNativeModule.setNavigationBarColor("#000000")
        ArtsyNativeModule.setAppLightContrast(true)
      })
    })

    return () => {
      unsubscribeBlur()
      unsubscribeFocus()
    }
  }, [])
}
