import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProps, useFormikContext } from "formik"
import { useEffect } from "react"

export function useArtworkForm(disabled?: boolean): { formik: FormikProps<ArtworkFormValues> } {
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    // We don't want to update the form values if the new submission flow is enabled
    // because the form values are managed by the new submission flow
    if (disabled) {
      return
    }

    GlobalStore.actions.myCollection.artwork.setFormValues(formik.values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formik.values)])

  return {
    formik,
  }
}
