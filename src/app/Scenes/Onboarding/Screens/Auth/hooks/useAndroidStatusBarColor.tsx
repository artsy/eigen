import { useNavigation } from "@react-navigation/native"
import { setAndroidNavigationBarColor } from "app/utils/setAndroidNavigationBarColor"
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
        setAndroidNavigationBarColor("light")
      })
    })

    const unsubscribeFocus = navigation.addListener("focus", () => {
      requestAnimationFrame(() => {
        setAndroidNavigationBarColor("dark")
      })
    })

    return () => {
      unsubscribeBlur()
      unsubscribeFocus()
    }
  }, [])
}
