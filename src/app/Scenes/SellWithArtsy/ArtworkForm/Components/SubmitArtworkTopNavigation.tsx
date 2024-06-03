import { BackButton, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { Alert, Keyboard, LayoutAnimation } from "react-native"

export const SubmitArtworkTopNavigation: React.FC<{}> = () => {
  const enableSaveAndExit = useFeatureFlag("AREnableSaveAndContinueSubmission")
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const hasCompletedForm = currentStep === "CompleteYourSubmission"
  const [backPressed, setBackPressed] = useState(false)

  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const handleSaveAndExitPress = async () => {
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
      const submissionId = await createOrUpdateSubmission(values, values.submissionId)

      if (submissionId) {
        GlobalStore.actions.artworkSubmission.setDraft({
          submissionID: submissionId,
          currentStep,
        })
      }
    } catch (error) {
      console.error("Something went wrong. The submission could not be saved.", error)

      Alert.alert("Something went wrong. The submission could not be saved.")
    }

    goBack()
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [currentStep])

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (backPressed) {
        goBack()
      }
    })

    return () => {
      hideSubscription.remove()
    }
  }, [backPressed])

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
    <Flex mx={2} height={40}>
      <Flex flexDirection="row" justifyContent="space-between">
        {currentStep === "SelectArtist" && (
          <BackButton
            showX
            style={{ zIndex: 100, overflow: "visible" }}
            onPress={() => {
              Keyboard.dismiss()
              setBackPressed(true)
            }}
          />
        )}

        {currentStep !== "SelectArtist" && (
          <Flex style={{ flexGrow: 1, alignItems: "flex-end" }}>
            <Touchable onPress={handleSaveAndExitPress}>
              <Text>{!hasCompletedForm && !!enableSaveAndExit ? "Save & " : ""}Exit</Text>
            </Touchable>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
