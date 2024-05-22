import { Flex, ProgressBar } from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { __unsafe__SubmissionArtworkFormNavigationRef } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { useCallback, useMemo } from "react"

// Steps that should not be counted in the progress bar
const NON_COUNTABLE_STEPS: SubmitArtworkScreen[] = ["StartFlow"]

// Steps that should be counted in the progress bar
const COUNTABLE_STEPS = ARTWORK_FORM_STEPS.filter(
  (step) => NON_COUNTABLE_STEPS.indexOf(step) === -1
)

const PROGRESS_BAR_HEIGHT = 22

export const SubmitArtworkProgressBar: React.FC = ({}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)

  const hasStartedFlowFromMyCollection = useMemo(() => {
    const routes = (
      __unsafe__SubmissionArtworkFormNavigationRef.current?.getState()?.routes || []
    ).map((route) => route.name)

    // This is required in case the reference value comes later than the first render
    if (currentStep === "SelectArtworkMyCollectionArtwork") {
      return true
    }

    if (routes && routes.includes("SelectArtworkMyCollectionArtwork")) {
      return true
    }

    return false
  }, [currentStep])

  // Returns the total steps based on whether the flow has started from My Collection or not
  // This is required for accurate progress bar calculation
  const getTotalSteps = useCallback(() => {
    return hasStartedFlowFromMyCollection
      ? COUNTABLE_STEPS
      : COUNTABLE_STEPS.filter((step) => step !== "SelectArtworkMyCollectionArtwork")
  }, [hasStartedFlowFromMyCollection])

  const totalSteps = getTotalSteps()

  const progress = (totalSteps.indexOf(currentStep) + 1) / totalSteps.length

  if (!currentStep || currentStep === "StartFlow") {
    // Returning a Flex with the same height as the progress bar to keep the layout consistent
    return <Flex height={PROGRESS_BAR_HEIGHT} />
  }

  const hasCompletedForm = currentStep === "CompleteYourSubmission"

  return (
    <Flex height={PROGRESS_BAR_HEIGHT}>
      <Flex>
        <ProgressBar
          progress={progress * 100}
          animationDuration={300}
          trackColor={hasCompletedForm ? "green100" : "blue100"}
        />
      </Flex>
    </Flex>
  )
}
