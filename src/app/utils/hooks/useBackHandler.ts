import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"
import { BackHandler } from "react-native"

/**
 * Hook to override back button behavior on **Android**.
 * use like `useBackHandler(() => true)` to prevent
 * back button from doing anything.
 *
 * @param handler: () => boolean
 */
export function useBackHandler(handler: () => boolean) {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", handler)

      // Return cleanup function to remove listener when component unmounts or loses focus
      return () => subscription.remove()
    }, [handler])
  )
}
