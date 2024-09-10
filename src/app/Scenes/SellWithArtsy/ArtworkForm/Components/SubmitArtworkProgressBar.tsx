import { CheckCircleFillIcon, Flex, ProgressBar } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { __unsafe__SubmissionArtworkFormNavigationRef } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  SUBMIT_ARTWORK_APPROVED_SUBMISSION_STEPS,
  SUBMIT_ARTWORK_DRAFT_SUBMISSION_STEPS,
  SubmitArtworkScreen,
  TIER_1_STATES,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { useCallback, useMemo } from "react"

// Steps that should not be counted in the progress bar
const NON_COUNTABLE_STEPS: SubmitArtworkScreen[] = ["StartFlow", "ArtistRejected"]

// Steps that should be counted in the progress bar
const DRAFT_SUBMISSION_COUNTABLE_STEPS = SUBMIT_ARTWORK_DRAFT_SUBMISSION_STEPS.filter(
  (step) => NON_COUNTABLE_STEPS.indexOf(step) === -1
)

const APPROVED_SUBMISSION_COUNTABLE_STEPS = SUBMIT_ARTWORK_APPROVED_SUBMISSION_STEPS.filter(
  (step) => NON_COUNTABLE_STEPS.indexOf(step) === -1
)

const PROGRESS_BAR_CONTAINER_HEIGHT = 22
const PROGRESS_BAR_HEIGHT = 4
const ICON_SIZE = 22

export const SubmitArtworkProgressBar: React.FC = ({}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const { values } = useFormikContext<SubmissionModel>()

  const hasStartedFlowFromMyCollection = useMemo(() => {
    const routes = (
      __unsafe__SubmissionArtworkFormNavigationRef.current?.getState()?.routes || []
    ).map((route) => route.name)

    // This is required in case the reference value comes later than the first render
    if (currentStep === "SubmitArtworkFromMyCollection") {
      return true
    }

    if (routes && routes.includes("SubmitArtworkFromMyCollection")) {
      return true
    }

    return false
  }, [currentStep])

  // Returns the total steps based on whether the flow has started from My Collection or not
  // This is required for accurate progress bar calculation
  const getTotalSteps = useCallback(() => {
    const allSteps =
      values.state && !TIER_1_STATES.includes(values.state)
        ? APPROVED_SUBMISSION_COUNTABLE_STEPS
        : DRAFT_SUBMISSION_COUNTABLE_STEPS

    return hasStartedFlowFromMyCollection
      ? allSteps
      : allSteps.filter((step) => step !== "SubmitArtworkFromMyCollection")
  }, [hasStartedFlowFromMyCollection])

  const totalSteps = getTotalSteps()

  const progress = (totalSteps.indexOf(currentStep) + 1) / totalSteps.length

  if (!currentStep || NON_COUNTABLE_STEPS.includes(currentStep)) {
    // Returning a Flex with the same height as the progress bar to keep the layout consistent
    return <Flex height={PROGRESS_BAR_CONTAINER_HEIGHT} />
  }

  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  return (
    <Flex
      height={PROGRESS_BAR_CONTAINER_HEIGHT}
      flexDirection="row"
      justifyContent="center"
      mt={0.5}
    >
      <Flex flex={1}>
        <ProgressBar
          progress={progress * 100}
          height={PROGRESS_BAR_HEIGHT}
          animationDuration={300}
          trackColor={hasCompletedForm ? "green100" : "blue100"}
          style={{ marginVertical: 0 }}
          backgroundColor="black5"
          progressBarStyle={{ borderRadius: PROGRESS_BAR_HEIGHT / 2 }}
        />
      </Flex>
      <Flex height={PROGRESS_BAR_HEIGHT} justifyContent="center" pl={0.5}>
        {!!hasCompletedForm && (
          <CheckCircleFillIcon height={ICON_SIZE} width={ICON_SIZE} fill="green100" />
        )}
      </Flex>
    </Flex>
  )
}
