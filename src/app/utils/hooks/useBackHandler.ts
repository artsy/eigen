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
      BackHandler.addEventListener("hardwareBackPress", handler)

      return () => BackHandler.removeEventListener("hardwareBackPress", handler)
    }, [handler])
  )
}
