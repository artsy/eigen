import { Screen } from "@artsy/palette-mobile"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { AuthModal } from "app/Scenes/Onboarding/Auth2/AuthModal"
import { AuthScenes } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { WelcomeBackground } from "app/Scenes/Onboarding/Auth2/components/WelcomeBackground"
import { useAndroidStatusBarColor } from "app/Scenes/Onboarding/Auth2/hooks/useAndroidStatusBarColor"
import React from "react"

export const AuthApp: React.FC = () => {
  useAndroidStatusBarColor()

  return (
    <Screen safeArea={false}>
      <Screen.Background>
        <WelcomeBackground />
      </Screen.Background>

      <Screen.Body>
        <BottomSheetModalProvider>
          <AuthModal>
            <AuthScenes />
          </AuthModal>
        </BottomSheetModalProvider>
      </Screen.Body>
    </Screen>
  )
}
