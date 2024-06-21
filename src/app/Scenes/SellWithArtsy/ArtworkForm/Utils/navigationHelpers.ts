import { NavigationProp, useNavigation, useNavigationState } from "@react-navigation/native"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkStackNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ARTWORK_FORM_FINAL_STEP,
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { updateMyCollectionArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/updateMyCollectionArtwork"
import {
  ArtworkDetailsFormModel,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { useFormikContext } from "formik"
import { useMemo } from "react"
import { Alert } from "react-native"

export const useSubmissionContext = () => {
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const setIsLoading = SubmitArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)
  const { currentStep } = SubmitArtworkFormStore.useStoreState((state) => state)

  const routes = useNavigationState((state) => state.routes)
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const { values, setFieldValue } = useFormikContext<ArtworkDetailsFormModel>()

  const validationSchema = useMemo(() => {
    return getCurrentValidationSchema(currentStep)
  }, [currentStep])

  const isValid = useMemo(() => {
    return validationSchema.isValidSync(values)
  }, [currentStep, values])

  const isFinalStep = currentStep === ARTWORK_FORM_FINAL_STEP

  const navigateToNextStep = async (props?: {
    step?: SubmitArtworkScreen
    skipMutation?: boolean
  }) => {
    try {
      setIsLoading(true)
      const nextStep =
        props?.step || ARTWORK_FORM_STEPS[ARTWORK_FORM_STEPS.indexOf(currentStep as any) + 1]

      const newValues = {
        ...values,
        state: (isFinalStep ? "SUBMITTED" : "DRAFT") as ArtworkDetailsFormModel["state"],
      }

      if (!props?.skipMutation) {
        try {
          const submissionId = await createOrUpdateSubmission(newValues, values.submissionId)

          if (!values.submissionId && submissionId) {
            setFieldValue("submissionId", submissionId)
          }
        } catch (error) {
          console.error("Error creating or updating submission", error)
          Alert.alert("Something went wrong. The submission could not be updated.")
          return
        }
      }

      if (newValues.state === "SUBMITTED") {
        // Reset saved draft if submission is successful
        GlobalStore.actions.artworkSubmission.setDraft(null)
        // Refetch associated My Collection artwork to display the updated submission status on the artwork screen.
        if (newValues.myCollectionArtworkID) {
          await updateMyCollectionArtwork({
            artworkID: newValues.myCollectionArtworkID,
          })
        }

        refreshMyCollection()
      }

      navigation.navigate?.(nextStep)
      setCurrentStep(nextStep)
    } catch (error) {
      console.error("Error navigating to next step", error)
      Alert.alert("Could not navigate to next step")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToPreviousStep = () => {
    if (!navigation.canGoBack()) {
      Alert.alert(
        "Are you sure you want to go back?",
        "You will lose any unsaved changes.",
        [
          {
            text: "Cancel",
            style: "cancel",
            isPreferred: true,
          },
          {
            text: "Exit",
            onPress: () => {
              goBack()
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      )
      return
    }

    const previousRoute = routes[routes.length - 2].name as keyof SubmitArtworkStackNavigation

    if (previousRoute) {
      setCurrentStep(previousRoute)
    }
    navigation.goBack?.()
  }

  return {
    isValid,
    currentStep,
    isFinalStep,
    navigateToNextStep,
    navigateToPreviousStep,
  }
}
