import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Form/useArtworkForm"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"
import { MediumPicker } from "./Components/MediumPicker"
import { PhotoPicker } from "./Components/PhotoPicker"
import { SizePicker } from "./Components/SizePicker"

export const MyCollectionAddArtwork = () => {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const navActions = useStoreActions(actions => actions.navigation)
  const { formik } = useArtworkForm()

  return (
    <Box>
      <Flex>
        <Button variant="noOutline" onPress={artworkActions.addArtworkCancel}>
          Cancel
        </Button>
        <Sans size="4" textAlign="center" weight="medium">
          Add artwork
        </Sans>
      </Flex>

      <Separator my={2} />

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
            onChangeText={formik.handleChange("artist")}
            onBlur={formik.handleBlur("artist")}
            value={formik.values.artist}
          />

          <MediumPicker />
          <SizePicker />
          <PhotoPicker />

          <Button variant="noOutline" onPress={navActions.navigateToAddTitleAndYear}>
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
