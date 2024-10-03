import { Screen } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
// import { AuthModal } from "app/Scenes/Onboarding/Auth2/AuthModal"
import { AuthScenes } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { AuthModal } from "app/Scenes/Onboarding/Auth2/components/AuthModal"
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
        <AuthContext.Provider>
          <AuthModal>
            <AuthScenes />
          </AuthModal>
        </AuthContext.Provider>
      </Screen.Body>
    </Screen>
  )
}
