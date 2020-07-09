import { FormikProps, useFormikContext } from "formik"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/artworkModel"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { useEffect } from "react"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues> } {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    artworkActions.setFormValues(formik.values)
  }, [formik.values])

  return {
    formik,
  }
}
