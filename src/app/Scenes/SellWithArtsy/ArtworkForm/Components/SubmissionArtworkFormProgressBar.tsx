import { Text } from "@artsy/palette-mobile"
import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { ARTWORK_FORM_STEPS } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { useFormikContext } from "formik"
import { useEffect } from "react"

export const SubmissionArtworkFormProgressBar: React.FC = ({}) => {
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)

  // TODO: Remove, this is for debugging only
  const { values } = useFormikContext<ArtworkDetailsFormModel>()
  useEffect(() => {
    console.log(JSON.stringify({ values }, null, 2))
  }, [values])

  return (
    <Text variant="xs" color="black60">
      {`Step ${ARTWORK_FORM_STEPS.indexOf(currentStep) + 1} / ${ARTWORK_FORM_STEPS.length}`}
    </Text>
  )
}
