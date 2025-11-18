import { Screen } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Screens/Auth/AuthScenes"
import { AuthBackground } from "app/Scenes/Onboarding/Screens/Auth/components/AuthBackground"
import { AuthModal } from "app/Scenes/Onboarding/Screens/Auth/components/AuthModal"
import { StatusBar } from "react-native"

export const AuthApp: React.FC = () => {
  return (
    <Screen safeArea={false}>
      <StatusBar translucent />
      <AuthContext.Provider>
        <Screen.Background>
          <AuthBackground />
        </Screen.Background>

        <Screen.Body>
          <AuthModal>
            <AuthScenes />
          </AuthModal>
        </Screen.Body>
      </AuthContext.Provider>
    </Screen>
  )
}
