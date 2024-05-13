import { Button, Flex, Spacer, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkProgressBar"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { navigate } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"

export const SubmitArtworkBottomNavigation: React.FC<{}> = () => {
  const { navigateToNextStep, navigateToPreviousStep } = useSubmissionContext()
  const { isValid } = useFormikContext<ArtworkDetailsFormModel>()

  const { currentStep, isLoading } = SubmitArtworkFormStore.useStoreState((state) => state)
  const { width: screenWidth } = useScreenDimensions()

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  const handleNextPress = () => {
    navigateToNextStep()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (!currentStep || currentStep === "StartFlow") {
    return null
  }

  if (currentStep === "CompleteYourSubmission") {
    return (
      <Flex
        borderTopWidth={1}
        borderTopColor="black10"
        pt={1}
        width={screenWidth}
        alignSelf="center"
      >
        <Flex px={2}>
          <SubmitArtworkProgressBar />

          <Spacer y={1} />

          <Button block onPress={() => {}}>
            View or Edit Submission
          </Button>

          <Spacer y={2} />

          <Button
            block
            onPress={() => {
              navigate("/sell/submissions/new", {
                replaceActiveScreen: true,
              })
            }}
            variant="outline"
          >
            Submit Another Artwork
          </Button>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex borderTopWidth={1} borderTopColor="black10" py={1} width={screenWidth} alignSelf="center">
      <Flex px={2}>
        <SubmitArtworkProgressBar />
        <Flex flexDirection="row" justifyContent="space-between" backgroundColor="white100">
          <Flex flexDirection="row" alignItems="center">
            <Touchable onPress={handleBackPress}>
              <Text underline>Back</Text>
            </Touchable>
          </Flex>
          <Button onPress={handleNextPress} disabled={!isValid || isLoading} loading={isLoading}>
            Continue
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
