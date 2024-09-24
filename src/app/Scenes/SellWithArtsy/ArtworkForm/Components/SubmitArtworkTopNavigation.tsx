import { BackButton, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useToast } from "app/Components/Toast/toastHook"
import { myCollectionUpdateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionUpdateArtwork"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkProgressBar"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useSubmitArtworkTracking } from "app/Scenes/SellWithArtsy/Hooks/useSubmitArtworkTracking"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { refreshSellScreen } from "app/utils/refreshHelpers"
import { useFormikContext } from "formik"
import { useEffect } from "react"
import { Alert, Keyboard, LayoutAnimation } from "react-native"

const HEADER_HEIGHT = 50

export const SubmitArtworkTopNavigation: React.FC<{}> = () => {
  const toast = useToast()
  const { trackTappedSubmissionSaveExit } = useSubmitArtworkTracking()
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  const { values } = useFormikContext<SubmissionModel>()

  const handleSaveAndExitPress = async () => {
    Keyboard.dismiss()

    if (hasCompletedForm) {
      // Reset form if user is on the last step
      // This is to ensure that the user can start a new submission
      // This is not required but is a nice to have as a second layer of protection
      GlobalStore.actions.artworkSubmission.setDraft(null)
      return goBack()
    }

    try {
      trackTappedSubmissionSaveExit(values.externalId, currentStep)

      await createOrUpdateSubmission(values, values.externalId)

      // If an submission has a my collection artwork, we need to update its values
      if (values.artwork.internalID) {
        try {
          const newValues = {
            artworkId: values.artwork.internalID,
            framedMetric: values.artwork.framedMetric,
            framedWidth: values.artwork.framedWidth,
            framedHeight: values.artwork.framedHeight,
            framedDepth: values.artwork.framedDepth,
            isFramed: values.artwork.isFramed,
            condition: values.artwork.condition || undefined,
            conditionDescription: values.artwork.conditionDescription,
          }

          // Make API call to update my collection artwork
          await myCollectionUpdateArtwork(newValues)
        } catch (error) {
          console.error(
            "Something went wrong. Some values on the MyC artwork could not be updated.",
            error
          )
          toast.show("Something went wrong. Some values could not be updated.", "bottom", {
            backgroundColor: "yellow100",
          })
        }
      }

      if (values.externalId) {
        GlobalStore.actions.artworkSubmission.setDraft({
          submissionID: values.externalId,
          currentStep,
        })
      }

      refreshSellScreen()
    } catch (error) {
      console.log({ error })
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

  const showXButton = [
    "StartFlow",
    "ArtistRejected",
    "SelectArtist",
    "SubmitArtworkFromMyCollection",
  ].includes(currentStep)
  const showProgressBar = !["StartFlow", "ArtistRejected"].includes(currentStep)
  const showSaveAndExit = ![
    "StartFlow",
    "ArtistRejected",
    "SelectArtist",
    "SubmitArtworkFromMyCollection",
  ].includes(currentStep)

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
              <Text variant="sm">{!hasCompletedForm ? "Save & " : ""}Exit</Text>
            </Touchable>
          </Flex>
        )}
      </Flex>
      {!!showProgressBar && <SubmitArtworkProgressBar />}
    </Flex>
  )
}
