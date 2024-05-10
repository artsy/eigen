import {
  CheckCircleFillIcon,
  Flex,
  ProgressBar,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { ARTWORK_FORM_STEPS } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"

const STEPS_WITHOUT_INPUT = ["SubmitArtworkStartFlow"]

const STEPS_WITH_INPUT = ARTWORK_FORM_STEPS.filter(
  (step) => STEPS_WITHOUT_INPUT.indexOf(step) === -1
)

const ICON_WIDTH = 18

const PROGRESS_BAR_HEIGHT = 22
export const SubmissionArtworkFormProgressBar: React.FC = ({}) => {
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()

  const progress = ARTWORK_FORM_STEPS.indexOf(currentStep) / STEPS_WITH_INPUT.length

  if (!currentStep || STEPS_WITHOUT_INPUT.includes(currentStep)) {
    // Returning a Flex with the same height as the progress bar to keep the layout consistent
    return <Flex height={PROGRESS_BAR_HEIGHT} />
  }

  const hasCompletedForm = currentStep === "ArtworkFormCompleteYourSubmission"
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
      {currentStep === "ArtworkFormCompleteYourSubmission" && (
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
