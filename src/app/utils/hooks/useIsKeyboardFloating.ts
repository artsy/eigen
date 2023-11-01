import { useScreenDimensions } from "@artsy/palette-mobile"
import { useEffect, useState } from "react"
import { Keyboard, KeyboardEvent } from "react-native"

export const useIsKeyboardFloating = () => {
  const [floating, setFloating] = useState(false)
  const { width: screenWidth } = useScreenDimensions()

  useEffect(() => {
    const onKeyboardWillChangeFrame = (e: KeyboardEvent) => {
      setFloating(e.endCoordinates.width !== screenWidth)
    }

    const keyboardListener = Keyboard.addListener(
      "keyboardWillChangeFrame",
      onKeyboardWillChangeFrame
    )

    return () => {
      keyboardListener.remove()
    }
  }, [screenWidth])

  return floating
}
