import {
  CheckCircleFillIcon,
  Flex,
  ProgressBar,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { SubmitArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { __unsafe__SubmissionArtworkFormNavigationRef } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { useCallback, useMemo } from "react"

// Steps that should not be counted in the progress bar
const NON_COUNTABLE_STEPS: SubmitArtworkScreen[] = ["StartFlow", "ArtistRejected"]

// Steps that should be counted in the progress bar
const COUNTABLE_STEPS = ARTWORK_FORM_STEPS.filter(
  (step) => NON_COUNTABLE_STEPS.indexOf(step) === -1
)

const ICON_WIDTH = 18

const PROGRESS_BAR_HEIGHT = 22

export const SubmitArtworkProgressBar: React.FC = ({}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const { width: screenWidth } = useScreenDimensions()

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

  const space = useSpace()

  // Returns the total steps based on whether the flow has started from My Collection or not
  // This is required for accurate progress bar calculation
  const getTotalSteps = useCallback(() => {
    return hasStartedFlowFromMyCollection
      ? COUNTABLE_STEPS
      : COUNTABLE_STEPS.filter((step) => step !== "SelectArtworkMyCollectionArtwork")
  }, [hasStartedFlowFromMyCollection])

  const totalSteps = getTotalSteps()

  const progress = (totalSteps.indexOf(currentStep) + 1) / totalSteps.length

  if (!currentStep || NON_COUNTABLE_STEPS.includes(currentStep)) {
    // Returning a Flex with the same height as the progress bar to keep the layout consistent
    return <Flex height={PROGRESS_BAR_HEIGHT} />
  }

  const hasCompletedForm = currentStep === "CompleteYourSubmission"
  const checkIconWidth = ICON_WIDTH + space(0.5)

  return (
    <Flex height={PROGRESS_BAR_HEIGHT}>
      <Flex
        // Subtracting the width of the check icon and the horizontal padding
        // to make sure the progress bar doesn't overflow
        width={
          hasCompletedForm
            ? screenWidth - 2 * space(2) - checkIconWidth
            : screenWidth - 2 * space(2)
        }
      >
        <ProgressBar
          progress={progress * 100}
          animationDuration={300}
          trackColor={hasCompletedForm ? "green100" : "blue100"}
        />
      </Flex>
      {!!hasCompletedForm && (
        <Flex
          position="absolute"
          alignSelf="flex-end"
          alignItems="flex-end"
          style={{ top: 2 }}
          width={ICON_WIDTH + space(0.5)}
        >
          <CheckCircleFillIcon height={ICON_WIDTH} width={ICON_WIDTH} fill="green100" />
        </Flex>
      )}
    </Flex>
  )
}
