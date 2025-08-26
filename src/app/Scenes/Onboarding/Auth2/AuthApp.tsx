import { Screen } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { AuthBackground } from "app/Scenes/Onboarding/Auth2/components/AuthBackground"
import { AuthModal } from "app/Scenes/Onboarding/Auth2/components/AuthModal"
import { useAndroidStatusBarColor } from "app/Scenes/Onboarding/Auth2/hooks/useAndroidStatusBarColor"
import { useSwitchStatusBarStyle } from "app/utils/useStatusBarStyle"
import React from "react"

export const AuthApp: React.FC = () => {
  useSwitchStatusBarStyle("light-content", "dark-content")
  useAndroidStatusBarColor()

  return (
    <AuthContext.Provider>
      <AuthBackground />
    </AuthContext.Provider>
    // <Screen safeArea={false}>
    //
    //     <Screen.Background>

    //     </Screen.Background>

    //     <Screen.Body>
    //       <AuthModal>
    //         <AuthScenes />
    //       </AuthModal>
    //     </Screen.Body>
    //
    // </Screen>
  )
}
