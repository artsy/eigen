import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkProgressBar"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { MotiView } from "moti"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"

export const SubmitArtworkTopNavigation: React.FC<{}> = () => {
  const { navigateToNextStep } = useSubmissionContext()
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const isKeyboardVisible = useIsKeyboardVisible(true)

  const handleSaveAndExitPress = () => {
    navigateToNextStep()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (!currentStep || currentStep === "StartFlow") {
    return null
  }

  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  return (
    <Flex mx={2}>
      {!hasCompletedForm && (
        <MotiView
          animate={{
            height: isKeyboardVisible ? 0 : 30,
          }}
          transition={{
            type: "timing",
            duration: 200,
          }}
        >
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex style={{ flexGrow: 1, alignItems: "flex-end" }}>
              <Touchable onPress={handleSaveAndExitPress}>
                <Text>Save & Exit</Text>
              </Touchable>
            </Flex>
          </Flex>
        </MotiView>
      )}

      <SubmitArtworkProgressBar />
    </Flex>
  )
}
