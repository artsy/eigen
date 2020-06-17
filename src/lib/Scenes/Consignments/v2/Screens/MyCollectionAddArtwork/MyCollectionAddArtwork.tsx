import { Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Form/useArtworkForm"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { Input } from "lib/Scenes/Search/Input"
import React from "react"
import { MediumPicker } from "./Components/MediumPicker"
import { PhotoPicker } from "./Components/PhotoPicker"
import { SizePicker } from "./Components/SizePicker"

export const MyCollectionAddArtwork = () => {
  const navActions = useStoreActions(actions => actions.navigation)
  const formik = useArtworkForm()

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
