import { useEffect } from "react"
import { BackHandler } from "react-native"

/**
 * Hook to override back button behavior.
 *
 * @param handler: () => boolean
 */
export function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handler)

    return () => BackHandler.removeEventListener("hardwareBackPress", handler)
  }, [handler])
}
