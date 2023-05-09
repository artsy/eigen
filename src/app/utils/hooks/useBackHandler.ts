import { useFocusEffect } from "@react-navigation/native"
import { goBack } from "app/system/navigation/navigate"
import { useCallback, useEffect } from "react"
import { BackHandler, InteractionManager } from "react-native"

/**
 * Hook to override back button behavior on **Android**.
 * use like `useBackHandler(() => true)` to prevent
 * back button from doing anything.
 *
 * @param handler: () => boolean
 */
export function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handler)

    return () => BackHandler.removeEventListener("hardwareBackPress", handler)
  }, [handler])
}

/**
 * Hook listener to override **Android** back button behavior and force going back in the navigation stack.
 *
 */
export function useAndroidGoBack() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // this is needed in order to wait for the animation to finish
        // before moving to the previous screen for better performance
        InteractionManager.runAfterInteractions(() => {
          goBack()
        })
        return true
      }
      BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
    }, [])
  )
}
