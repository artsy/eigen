import { useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkQueryRenderer } from "app/Scenes/Artwork/Artwork"
import { Screen } from "palette"
import { OnboardingNavigationStack } from "./OnboardingNavigationContainer"

interface ArtworkScreenProps extends StackScreenProps<OnboardingNavigationStack, "ArtworkScreen"> {}

export const ArtworkScreen: React.FC<ArtworkScreenProps> = ({ route }) => {
  const { artworkID } = route?.params
  const { goBack } = useNavigation()
  return (
    <Screen>
      <Screen.Header onBack={goBack} />
      <Screen.Body fullwidth>
        <ArtworkQueryRenderer isVisible artworkID={artworkID} />
      </Screen.Body>
    </Screen>
  )
}
