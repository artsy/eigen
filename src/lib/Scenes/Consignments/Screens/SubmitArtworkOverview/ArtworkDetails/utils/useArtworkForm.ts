import { FormikProps, useFormikContext } from "formik"
import { useEffect, useState } from "react"
import { ArtworkFormValues } from "./schema"

export function useArtworkForm(): { formik: FormikProps<ArtworkFormValues>; artworkDetailsForm: ArtworkFormValues } {
  const formik = useFormikContext<ArtworkFormValues>()

  const [artworkDetailsForm, setArtworkDetailsForm] = useState<ArtworkFormValues>({
    artist: "",
    artistId: "",
    title: "",
  })

  useEffect(() => {
    setArtworkDetailsForm(formik.values)
  }, [formik.values])

  return {
    formik,
    artworkDetailsForm,
  }
}
