import { Button, Flex } from "@artsy/palette-mobile"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"

interface SubmissionNavigationControlsProps {}
export const SubmissionNavigationControls: React.FC<SubmissionNavigationControlsProps> = () => {
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    navigateToNextStep()
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Button variant="outline" onPress={handleBackPress}>
        Back
      </Button>
      <Button onPress={handleNextPress}>Next</Button>
    </Flex>
  )
}
