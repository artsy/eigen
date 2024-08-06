import EventEmitter from "events"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import {
  SubmitArtworkStackNavigation,
  __unsafe__SubmissionArtworkFormNavigationRef,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ARTWORK_FORM_TIER_1_FINAL_STEP,
  ARTWORK_FORM_TIER_2_FINAL_STEP,
  TIER_1_STATES,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import {
  SubmissionModel,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { goBack } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { useMemo } from "react"
import { Alert } from "react-native"

export const SubmitArtworkFormEvents = new EventEmitter()
SubmitArtworkFormEvents.setMaxListeners(20)

export const NAVIGATE_TO_NEXT_STEP_EVENT = "NAVIGATE_TO_NEXT_STEP_EVENT"
export const NAVIGATE_TO_PREVIOUS_STEP_EVENT = "NAVIGATE_TO_PREVIOUS_STEP_EVENT"

export const useSubmissionContext = () => {
  const setCurrentStep = SubmitArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const { currentStep, isLoading } = SubmitArtworkFormStore.useStoreState((state) => state)
  const navigation = useNavigation<NavigationProp<SubmitArtworkStackNavigation>>()

  const { values } = useFormikContext<SubmissionModel>()

  const validationSchema = useMemo(() => {
    return getCurrentValidationSchema(currentStep)
  }, [currentStep])

  const isValid = useMemo(() => {
    return validationSchema.isValidSync(values)
  }, [currentStep, values])

  const isFinalStep =
    values.state && TIER_1_STATES.includes(values.state)
      ? currentStep === ARTWORK_FORM_TIER_1_FINAL_STEP
      : currentStep === ARTWORK_FORM_TIER_2_FINAL_STEP

  const navigateToNextStep = async () => {
    SubmitArtworkFormEvents.emit(NAVIGATE_TO_NEXT_STEP_EVENT)
  }

  const navigateToPreviousStep = () => {
    SubmitArtworkFormEvents.emit(NAVIGATE_TO_PREVIOUS_STEP_EVENT)

    // TODO: Fix this with proper mocking of the ref
    if (!__unsafe__SubmissionArtworkFormNavigationRef.current?.canGoBack() && !__TEST__) {
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
    // Order is important here to make sure getCurrentRoute returns the correct value
    navigation.goBack?.()
    const previousStepId = getCurrentRoute()

    if (previousStepId) {
      setCurrentStep(previousStepId)
    }
  }

  return {
    isValid,
    isLoading,
    currentStep,
    isFinalStep,
    navigateToNextStep,
    navigateToPreviousStep,
  }
}
