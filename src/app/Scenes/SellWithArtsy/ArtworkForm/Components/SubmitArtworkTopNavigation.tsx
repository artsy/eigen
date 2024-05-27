import { BackButton, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { useFormikContext } from "formik"
import { MotiView } from "moti"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"

export const SubmitArtworkTopNavigation: React.FC<{}> = () => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const isKeyboardVisible = useIsKeyboardVisible(true)
  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const handleSaveAndExitPress = () => {
    if (hasCompletedForm) {
      // Reset form if user is on the last step
      // This is to ensure that the user can start a new submission
      // This is not required but is a nice to have as a second layer of protection
      GlobalStore.actions.artworkSubmission.setDraft(null)
      return goBack()
    }

    if (values.submissionId) {
      GlobalStore.actions.artworkSubmission.setDraft({
        submissionID: values.submissionId,
        currentStep,
      })
    }
    goBack()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (!currentStep) {
    return null
  }

  if (["StartFlow", "ArtistRejected"].includes(currentStep)) {
    return (
      <Flex py={1} px={2} flexDirection="row">
        <BackButton showX style={{ zIndex: 100, overflow: "visible" }} onPress={goBack} />
      </Flex>
    )
  }
  return (
    <Flex mx={2}>
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
          {currentStep === "SelectArtist" && (
            <BackButton showX style={{ zIndex: 100, overflow: "visible" }} onPress={goBack} />
          )}

          {currentStep !== "SelectArtist" && (
            <Flex style={{ flexGrow: 1, alignItems: "flex-end" }}>
              <Touchable onPress={handleSaveAndExitPress}>
                <Text>{!hasCompletedForm ? "Save & " : ""}Exit</Text>
              </Touchable>
            </Flex>
          )}
        </Flex>
      </MotiView>
    </Flex>
  )
}
