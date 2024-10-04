import { Input } from "@artsy/palette-mobile"
import { AuthScreen } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthScreen } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useEffect } from "react"

interface UseInputAutofocusProps {
  delay?: number
  enabled?: boolean
  inputRef: React.RefObject<Input>
  screenName: AuthScreen["name"]
}

export const useInputAutofocus = ({
  screenName,
  inputRef,
  enabled = true,
  delay = 0,
}: UseInputAutofocusProps) => {
  const currentScreen = useAuthScreen()

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (currentScreen.name !== screenName) {
      return
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        inputRef.current?.focus()
      }, delay)
    })
  }, [currentScreen])
}
