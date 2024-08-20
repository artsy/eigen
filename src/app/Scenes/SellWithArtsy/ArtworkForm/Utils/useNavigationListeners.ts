import { useIsFocused } from "@react-navigation/native"
import {
  NAVIGATE_TO_NEXT_STEP_EVENT,
  NAVIGATE_TO_PREVIOUS_STEP_EVENT,
  SubmitArtworkFormEvents,
  useSubmissionContext,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/utils/submissionModelState"
import { useFormikContext } from "formik"
import { useEffect } from "react"

export const useNavigationListeners = ({
  onNextStep,
  onPreviousStep,
}: {
  onNextStep: () => void
  onPreviousStep?: () => void
}) => {
  const { values } = useFormikContext<SubmissionModel>()
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
