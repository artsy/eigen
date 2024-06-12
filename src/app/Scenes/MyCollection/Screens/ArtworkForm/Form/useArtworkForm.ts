import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { FormikProps, useFormikContext } from "formik"
import { useEffect } from "react"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues> } {
  const formik = useFormikContext<ArtworkFormValues>()
  const enableNewSubmissionFlow = useFeatureFlag("AREnableNewSubmissionFlow")

  useEffect(() => {
    // We don't want to update the form values if the new submission flow is enabled
    // because the form values are managed by the new submission flow
    if (enableNewSubmissionFlow) {
      return
    }

    GlobalStore.actions.myCollection.artwork.setFormValues(formik.values)
  }, [formik.values])

  return {
    formik,
  }
}
