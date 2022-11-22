import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { StatusBar } from "react-native"

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
