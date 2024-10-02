import { Screen } from "@artsy/palette-mobile"
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
        <AuthModal mt={6} mb={4}>
          <AuthScenes />
        </AuthModal>
      </Screen.Body>
    </Screen>
  )
}
