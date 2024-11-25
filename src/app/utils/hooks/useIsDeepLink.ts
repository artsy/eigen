import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Linking } from "react-native"

/**
 * This is a hook that returns whether the user came from a deep link or not
 * This can be used to avoid rendering content in previous screens in react-navigation history
 * @returns {isDeepLink: boolean | null} isDeepLink is true if the user came from a deep link
 */
export const useIsDeepLink = () => {
  const [isDeepLink, setIsDeepLink] = useState<boolean | null>(null)

  const isFocused = useIsFocused()

  useEffect(() => {
    // When the user comes back from a deep link,
    // we want to show content again
    if (isFocused && isDeepLink === true) {
      setIsDeepLink(false)
    }
  }, [isFocused])

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        const isDeepLink = !!url
        if (!isDeepLink) {
          setIsDeepLink(false)
        } else {
          setIsDeepLink(true)
        }
      })
      .catch((error) => {
        console.error("Error getting initial URL", error)
        setIsDeepLink(false)
      })
  }, [])

  return {
    isDeepLink,
  }
}
