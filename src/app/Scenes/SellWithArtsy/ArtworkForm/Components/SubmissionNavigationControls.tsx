import { BackButton, Button, Flex, useSpace } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { goBack } from "app/system/navigation/navigate"

export const SubmissionNavigationControls: React.FC<{}> = () => {
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)

  const space = useSpace()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    navigateToNextStep()
  }

  if (!currentStep || currentStep === "SubmitArtworkStartFlow") {
    return (
      <Flex backgroundColor="white100" py={1}>
        <BackButton
          showX
          style={{ left: space(2), zIndex: 100, overflow: "visible" }}
          onPress={handleBackPress}
        />
      </Flex>
    )
  }

  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" backgroundColor="white100">
        <Flex flexDirection="row" alignItems="center">
          <BackButton onPress={goBack} style={{ left: space(2), bottom: 2 }} />
          <Button variant="text" onPress={handleBackPress}>
            Back
          </Button>
        </Flex>
        <Button variant="text" onPress={handleNextPress}>
          Save & Exit
        </Button>
      </Flex>
    </>
  )
}
