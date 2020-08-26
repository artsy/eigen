import { FormikProps, useFormikContext } from "formik"
import { ArtworkFormValues } from "lib/Scenes/Consignments/v2/State/MyCollectionArtworkModel"
import { AppStore } from "lib/store/AppStore"
import { useEffect } from "react"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues> } {
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    AppStore.actions.myCollection.artwork.setFormValues(formik.values)
  }, [formik.values])

  return {
    formik,
  }
}
