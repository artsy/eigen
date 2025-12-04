import { OwnerType } from "@artsy/cohesion"
import { Screen } from "@artsy/palette-mobile"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScenes } from "app/Scenes/Onboarding/Screens/Auth/AuthScenes"
import { AuthBackground } from "app/Scenes/Onboarding/Screens/Auth/components/AuthBackground"
import { AuthModal } from "app/Scenes/Onboarding/Screens/Auth/components/AuthModal"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
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
          <ProvideScreenTrackingWithCohesionSchema
            info={screen({ context_screen_owner_type: "authModal" as any })}
          >
            <AuthModal>
              <AuthScenes />
            </AuthModal>
          </ProvideScreenTrackingWithCohesionSchema>
        </Screen.Body>
      </AuthContext.Provider>
    </Screen>
  )
}
