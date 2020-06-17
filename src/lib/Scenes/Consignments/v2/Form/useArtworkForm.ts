import { useFormikContext } from "formik"
import { useEffect } from "react"
import { ArtworkFormValues } from "../State/artworkModel"
import { useStoreActions } from "../State/hooks"

export function useArtworkForm() {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const formik = useFormikContext<ArtworkFormValues>()

  useEffect(() => {
    artworkActions.setFormValues(formik.values)
  }, [formik.values])

  return formik
}
