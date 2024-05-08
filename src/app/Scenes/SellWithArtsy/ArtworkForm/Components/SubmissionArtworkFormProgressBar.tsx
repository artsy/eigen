import { Flex, ProgressBar } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { ARTWORK_FORM_STEPS } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"

const STEPS_WITHOUT_INPUT = ["SubmitArtworkStartFlow", "ArtworkFormCompleteYourSubmission"]

const STEPS_WITH_INPUT = ARTWORK_FORM_STEPS.filter(
  (step) => STEPS_WITHOUT_INPUT.indexOf(step) === -1
)

const PROGRESS_BAR_HEIGHT = 22
export const SubmissionArtworkFormProgressBar: React.FC = ({}) => {
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)

  const progress = ARTWORK_FORM_STEPS.indexOf(currentStep) / STEPS_WITH_INPUT.length

  if (!currentStep || STEPS_WITHOUT_INPUT.includes(currentStep)) {
    // Returning a Flex with the same height as the progress bar to keep the layout consistent
    return <Flex height={PROGRESS_BAR_HEIGHT} />
  }

  return (
    <Flex height={PROGRESS_BAR_HEIGHT}>
      <ProgressBar progress={progress * 100} animationDuration={300} />
    </Flex>
  )
}
