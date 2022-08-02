import { useNavigation } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkQueryRenderer } from "app/Scenes/Artwork/Artwork"
import { Screen } from "palette"
import { OnboardingPersonalization2NavigationStack } from "./OnboardingPersonalization2"

interface ArtworkScreenProps
  extends StackScreenProps<OnboardingPersonalization2NavigationStack, "ArtworkScreen"> {}

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
