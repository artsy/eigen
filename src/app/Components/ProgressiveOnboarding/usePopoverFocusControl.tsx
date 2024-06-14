import { useIsFocused, useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"

export const usePopoverFocusControl = (isDisplayable: boolean) => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)

  // This is a listener that will be called when the screen is blurred
  // This is to make sure that the popover is not displayed when the screen is not focused
  useEffect(() => {
    const blurListener = navigation.addListener("blur", () => {
      console.warn("BLUR LISTENER CALLED")
      setIsPopoverVisible(false)
    })

    return blurListener
  }, [isDisplayable, isFocused])

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      console.warn("focus LISTENER CALLED")
      setIsPopoverVisible(true)
    })

    return focusListener
  }, [isDisplayable, isFocused])

  return {
    isPopoverVisible,
  }
}
