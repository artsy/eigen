import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React, { useEffect } from "react"

import { FormikHandlers, useFormik } from "formik"
import { ArtworkFormValues } from "../../State/artworkModel"
import { formValidation } from "./formValidation"

export const MyCollectionAddArtwork = () => {
  const navActions = useStoreActions(actions => actions.navigation)
  const artworkActions = useStoreActions(actions => actions.artwork)

  const initialFormValues = {
    artist: "Andy Warhol",
    title: "Artwork title",
    year: "1982",
  }

  const formik = useFormik<ArtworkFormValues>({
    initialValues: initialFormValues,
    initialErrors: formValidation(initialFormValues),
    validate: formValidation,
    onSubmit: artworkActions.addArtwork,
  })

  useEffect(() => {
    artworkActions.initializeFormik(formik)
  }, [])

  return (
    <Box>
      <Flex mt={4}>
        <Sans size="4" textAlign="center" weight="medium" style={{ position: "relative", top: -21 }}>
          Add artwork
        </Sans>
      </Flex>

      <Separator mt={0} mb={2} />

      <Sans size="4" textAlign="center">
        Add details about your work for a price {"\n"}
        evaluation and market insights.
      </Sans>

      <ScreenMargin>
        <Join separator={<Spacer my={1} />}>
          <Input
            title="Artist"
            placeholder="Search artists"
            icon={<SearchIcon width={18} height={18} />}
            onChangeText={formik.handleChange("artist") as FormikHandlers["handleChange"]}
            onBlur={formik.handleBlur("artist") as FormikHandlers["handleBlur"]}
            value={formik.values.artist}
          />

          <Input title="Medium" placeholder="Select" />
          <Input title="Size" placeholder="Select" />

          <Button variant="noOutline" onPress={() => navActions.navigateToAddArtworkPhotos()}>
            Photos (optional)
          </Button>

          <Button variant="noOutline" onPress={() => navActions.navigateToAddTitleAndYear()}>
            Title & year (optional)
          </Button>

          <Button disabled={!formik.isValid} block onPress={formik.handleSubmit}>
            Complete
          </Button>

          {formik.errors ? <Sans size="3">{JSON.stringify(formik.errors)}</Sans> : null}
        </Join>
      </ScreenMargin>
    </Box>
  )
}
