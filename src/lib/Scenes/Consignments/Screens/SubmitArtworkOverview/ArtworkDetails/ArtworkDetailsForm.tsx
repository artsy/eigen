import { FormikProvider, useFormik } from "formik"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { Input, Spacer } from "palette"
import React from "react"
import { ArtistAutosuggest } from "./ArtistAutosuggest"
import { ArtworkFormValues, artworkSchema, validateArtworkSchema } from "./utils/schema"

interface ArtworkDetailsFormProps {
  // TODO
  handlePress: any
}

export const ArtworkDetailsForm: React.FC<ArtworkDetailsFormProps> = ({ handlePress }) => {
  const formikbag = useFormik<ArtworkFormValues>({
    // enableReinitialize: true,
    initialValues: {
      artist: "",
      artistId: "",
      title: "",
    },
    initialErrors: validateArtworkSchema({
      artist: "",
      artistId: "",
      title: "",
    }),
    onSubmit: () => console.log("button click"),
    validationSchema: artworkSchema,
  })

  // TODO: values
  const { setFieldValue } = formikbag

  const handleArtistSelection = (selectedArtist: AutosuggestResult) => {
    setFieldValue("artist", selectedArtist.displayLabel)
    setFieldValue("artistId", selectedArtist.internalID)
    handlePress()
  }

  return (
    <FormikProvider value={formikbag}>
      <ArtistAutosuggest onResultPress={handleArtistSelection} />
      <Spacer mt={2} />
      <Input title="Title" placeholder="Add Title or Write 'Unknown'" />
      <Spacer mt={2} />
      <Input title="Year" placeholder="YYYY" />
      <Spacer mt={2} />
      <Input title="Materials" placeholder="Oil on Canvas, Mixed Media, Lithograph..." />
      <Spacer mt={2} />
    </FormikProvider>
  )
}
