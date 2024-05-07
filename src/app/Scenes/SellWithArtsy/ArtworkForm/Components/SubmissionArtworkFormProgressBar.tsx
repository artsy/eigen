import { ProgressBar } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { ARTWORK_FORM_STEPS } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"

export const SubmissionArtworkFormProgressBar: React.FC = ({}) => {
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)

  const progress = ARTWORK_FORM_STEPS.indexOf(currentStep) / ARTWORK_FORM_STEPS.length

  return <ProgressBar progress={progress * 100} />
}
