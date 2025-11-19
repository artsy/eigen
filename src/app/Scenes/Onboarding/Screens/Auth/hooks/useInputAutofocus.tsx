import { Input } from "@artsy/palette-mobile"
import { AuthScreen } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { useAuthScreen } from "app/Scenes/Onboarding/Screens/Auth/hooks/useAuthNavigation"
import { useEffect } from "react"

interface UseInputAutofocusProps {
  delay?: number
  enabled?: boolean
  inputRef: React.RefObject<Input | null>
  screenName: AuthScreen["name"]
}

export const useInputAutofocus = ({
  screenName,
  inputRef,
  enabled = true,
  delay = 100,
}: UseInputAutofocusProps) => {
  const currentScreen = useAuthScreen()

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (currentScreen.name !== screenName) {
      return
    }

    let timeout: ReturnType<typeof setTimeout>

    requestAnimationFrame(() => {
      timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, delay)
    })

    return () => {
      clearTimeout(timeout)
    }
  }, [currentScreen])
}
