import { Screen } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Auth2/AuthScenes"
import { AuthBackground } from "app/Scenes/Onboarding/Auth2/components/AuthBackground"
import { AuthModal } from "app/Scenes/Onboarding/Auth2/components/AuthModal"

export const AuthApp: React.FC = () => {
  return (
    <Screen safeArea={false}>
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
