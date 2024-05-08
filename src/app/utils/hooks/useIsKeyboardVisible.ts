import { useEffect, useState } from "react"
import { Keyboard } from "react-native"

export const useIsKeyboardVisible = (before = false) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      before ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true) // or some other action
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      before ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false) // or some other action
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  return isKeyboardVisible
}
