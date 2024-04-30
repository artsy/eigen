import { Button, Flex } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { on } from "events"
import { useFormikContext } from "formik"

interface SubmissionNavigationControlsProps {
  onBackPress: () => void
  onNextPress: () => void
}
export const SubmissionNavigationControls: React.FC<SubmissionNavigationControlsProps> = ({
  onBackPress,
  onNextPress,
}) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Button variant="outline" onPress={onBackPress}>
        Back
      </Button>
      <Button onPress={onNextPress}>Next</Button>
    </Flex>
  )
}
