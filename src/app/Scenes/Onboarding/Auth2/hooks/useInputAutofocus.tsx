import { Input } from "@artsy/palette-mobile"
import { AuthScreen } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthScreen } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useEffect } from "react"
import { InteractionManager } from "react-native"

interface UseInputAutofocusProps {
  screenName: AuthScreen["name"]
  inputRef: React.RefObject<Input>
  enabled?: boolean
}

export const useInputAutofocus = ({
  screenName,
  inputRef,
  enabled = true,
}: UseInputAutofocusProps) => {
  const currentScreen = useAuthScreen()

  useEffect(() => {
    if (enabled) {
      if (currentScreen.name === screenName) {
        InteractionManager.runAfterInteractions(() => {
          inputRef.current?.focus()
        })
      }
    }
  }, [currentScreen])
}
