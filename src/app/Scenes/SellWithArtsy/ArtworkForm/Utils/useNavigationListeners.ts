import { useIsFocused } from "@react-navigation/native"
import {
  NAVIGATE_TO_NEXT_STEP_EVENT,
  NAVIGATE_TO_PREVIOUS_STEP_EVENT,
  SubmitArtworkFormEvents,
  useSubmissionContext,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"
import { useEffect } from "react"

export const useNavigationListeners = ({
  onNextStep,
  onPreviousStep,
}: {
  onNextStep: () => void
  onPreviousStep?: () => void
}) => {
  const { values } = useFormikContext<ArtworkDetailsFormModel>()
  const { currentStep } = useSubmissionContext()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) {
      return
    }
    SubmitArtworkFormEvents.on(NAVIGATE_TO_NEXT_STEP_EVENT, onNextStep)

    return () => {
      SubmitArtworkFormEvents.removeAllListeners(NAVIGATE_TO_NEXT_STEP_EVENT)
    }
  }, [isFocused, currentStep, values])

  useEffect(() => {
    if (!isFocused) {
      return
    }

    if (onPreviousStep) {
      SubmitArtworkFormEvents.on(NAVIGATE_TO_PREVIOUS_STEP_EVENT, () => {
        onPreviousStep()
      })
    }

    return () => {
      SubmitArtworkFormEvents.removeAllListeners(NAVIGATE_TO_PREVIOUS_STEP_EVENT)
    }
  }, [isFocused, currentStep, values])
}
