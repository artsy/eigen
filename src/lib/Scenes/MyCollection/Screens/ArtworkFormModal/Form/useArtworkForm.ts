import { FormikProps, useFormikContext } from "formik"
import { ArtworkFormValues } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "lib/store/GlobalStore"
import { useEffect } from "react"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues> } {
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    GlobalStore.actions.myCollection.artwork.setFormValues(formik.values)
  }, [formik.values])

  return {
    formik,
  }
}
