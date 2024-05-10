import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { MotiView } from "moti"

export const SubmissionNavigationControls: React.FC<{}> = () => {
  const { navigateToNextStep } = useSubmissionContext()
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)
  const isKeyboardVisible = useIsKeyboardVisible(true)

  const handleSaveAndExitPress = () => {
    navigateToNextStep()
  }

  if (
    !currentStep ||
    currentStep === "SubmitArtworkStartFlow" ||
    currentStep === "ArtworkFormCompleteYourSubmission"
  ) {
    return null
  }

  return (
    <MotiView
      animate={{
        height: isKeyboardVisible ? 0 : 30,
      }}
      transition={{
        type: "timing",
        duration: 200,
      }}
    >
      <Flex flexDirection="row" mx={2} justifyContent="space-between">
        <Flex style={{ flexGrow: 1, alignItems: "flex-end" }}>
          <Touchable onPress={handleSaveAndExitPress}>
            <Text>Save & Exit</Text>
          </Touchable>
        </Flex>
      </Flex>
    </MotiView>
  )
}
