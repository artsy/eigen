import { BackButton, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkProgressBar"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { refreshSellScreen } from "app/utils/refreshHelpers"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { Alert, Keyboard, LayoutAnimation } from "react-native"

const HEADER_HEIGHT = 50

export const SubmitArtworkTopNavigation: React.FC<{}> = () => {
  const { trackTappedSubmissionSaveExit } = useSubmitArtworkTracking()
  const enableSaveAndExit = useFeatureFlag("AREnableSaveAndContinueSubmission")
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const { navigateToPreviousStep } = useSubmissionContext()

  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const handleSaveAndExitPress = async () => {
    Keyboard.dismiss()
    if (!enableSaveAndExit) {
      if (hasCompletedForm) {
        goBack()
        return
      }

      Alert.alert(
        "Are you sure you want to exit?",
        "Your artwork will not be submitted.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => goBack(),
            style: "destructive",
          },
        ],
        { cancelable: true }
      )
      return
    }

    if (hasCompletedForm) {
      // Reset form if user is on the last step
      // This is to ensure that the user can start a new submission
      // This is not required but is a nice to have as a second layer of protection
      GlobalStore.actions.artworkSubmission.setDraft(null)
      return goBack()
    }

    try {
      trackTappedSubmissionSaveExit(values.submissionId, currentStep)

      const submissionId = await createOrUpdateSubmission(values, values.submissionId)

      if (submissionId) {
        GlobalStore.actions.artworkSubmission.setDraft({
          submissionID: submissionId,
          currentStep,
        })
      }

      refreshSellScreen()
    } catch (error) {
      console.error("Something went wrong. The submission could not be saved.", error)

      Alert.alert("Something went wrong. The submission could not be saved.")
    }

    goBack()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  if (!currentStep) {
    return null
  }

  const showXButton = ["StartFlow", "ArtistRejected", "SelectArtist"].includes(currentStep)
  const showProgressBar = !["StartFlow", "ArtistRejected"].includes(currentStep)
  const showSaveAndExit = !["StartFlow", "ArtistRejected", "SelectArtist"].includes(currentStep)

  const handleBackPress = () => {
    goBack()
  }

  return (
    <Flex mx={2} mb={2} height={HEADER_HEIGHT}>
      <Flex flexDirection="row" justifyContent="space-between" height={30} mb={1}>
        {!!showXButton && (
          <BackButton
            showX
            style={{ zIndex: 100, overflow: "visible" }}
            onPress={() => handleBackPress()}
          />
        )}
        {!!showSaveAndExit && (
          <Flex style={{ flexGrow: 1, alignItems: "flex-end" }}>
            <Touchable onPress={handleSaveAndExitPress}>
              <Text>{!hasCompletedForm && !!enableSaveAndExit ? "Save & " : ""}Exit</Text>
            </Touchable>
          </Flex>
        )}
      </Flex>
      {!!showProgressBar && <SubmitArtworkProgressBar />}
    </Flex>
  )
}
