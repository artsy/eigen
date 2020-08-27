import { FormikProps, useFormikContext } from "formik"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/ConsignmentsArtworkModel"
import { AppStore } from "lib/store/AppStore"
import { useEffect } from "react"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues> } {
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    AppStore.actions.consignments.artwork.setFormValues(formik.values)
  }, [formik.values])

  return {
    formik,
  }
}
