import { Button, Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { SubmissionArtworkFormProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormProgressBar"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"

export const SubmissionArtworkBottomNavigation: React.FC<{}> = () => {
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)
  const { width: screenWidth } = useScreenDimensions()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    navigateToNextStep()
  }

  if (!currentStep || currentStep === "SubmitArtworkStartFlow") {
    return null
  }

  return (
    <Flex borderTopWidth={1} borderTopColor="black10" pt={1} width={screenWidth} alignSelf="center">
      <Flex px={2}>
        <SubmissionArtworkFormProgressBar />
        <Flex flexDirection="row" justifyContent="space-between" backgroundColor="white100">
          <Flex flexDirection="row" alignItems="center">
            <Touchable onPress={handleBackPress}>
              <Text underline>Back</Text>
            </Touchable>
          </Flex>
          <Button onPress={handleNextPress}>Continue</Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
