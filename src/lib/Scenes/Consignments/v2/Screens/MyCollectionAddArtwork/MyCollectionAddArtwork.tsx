import { BorderBox, Box, Button, Flex, Join, Sans, Separator, Spacer } from "@artsy/palette"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Screens/MyCollectionAddArtwork/Form/useArtworkForm"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import React, { useEffect } from "react"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { MediumPicker } from "./Components/MediumPicker"

import NavigatorIOS from "react-native-navigator-ios"
import { PhotoPicker } from "./Components/PhotoPicker"
import { SizePicker } from "./Components/SizePicker"

export const MyCollectionAddArtwork: React.FC<{ navigator: NavigatorIOS }> = props => {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const navActions = useStoreActions(actions => actions.navigation)
  const { formik } = useArtworkForm()

  useEffect(() => {
    navActions.setNavigator(props.navigator)
  }, [])

  return (
    <Box>
      <Flex flexGrow={1}>
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
          <ArtistAutosuggest />
          <MediumPicker />
          <SizePicker />
        </Join>
      </ScreenMargin>

      <Spacer my={2} />

      <Box>
        <BorderBox px={1}>
          <PhotoPicker />
        </BorderBox>
        {/* FIXME: Is there a <StackableBorderBox> for iOS? */}
        <BorderBox px={1} position="relative" top={-1}>
          <Button variant="noOutline" onPress={navActions.navigateToAddTitleAndYear}>
            Title & year (optional)
          </Button>
        </BorderBox>
      </Box>

      <Spacer my={2} />

      <ScreenMargin>
        <Button disabled={!formik.isValid} block onPress={formik.handleSubmit}>
          Complete
        </Button>

        {formik.errors ? <Sans size="3">{JSON.stringify(formik.errors)}</Sans> : null}
      </ScreenMargin>
    </Box>
  )
}
