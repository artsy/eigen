import { useNavigation } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { StatusBar, StatusBarStyle } from "react-native"

// Sets the status bar style to light when the screen is focused
// AND resets it to the default dark style when the screen is blurred
export const useLightStatusBarStyle = () => {
  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      StatusBar.setBarStyle("light-content")
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      StatusBar.setBarStyle("dark-content")
    })

    return unsubscribe
  }, [navigation])
}

// same as useLightStatusBarStyle but allows you to specify the styles
export const useSwitchStatusBarStyle = (
  styleOnFocus: StatusBarStyle,
  styleOnBlur: StatusBarStyle
) => {
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  const navigation = useNavigation()
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      StatusBar.setBarStyle(theme === "light" ? styleOnFocus : styleOnBlur)
    })

    return unsubscribe
  }, [navigation])

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      StatusBar.setBarStyle(theme === "light" ? styleOnBlur : styleOnFocus)
    })

    return unsubscribe
  }, [navigation])
}
