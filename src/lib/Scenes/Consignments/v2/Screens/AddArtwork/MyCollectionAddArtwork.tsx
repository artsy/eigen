import { BorderBox, Box, Button, Flex, Join, Sans, Spacer } from "@artsy/palette"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/Consignments/v2/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Screens/AddArtwork/Form/useArtworkForm"
import { useStoreActions, useStoreState } from "lib/Scenes/Consignments/v2/State/hooks"
import React from "react"
import { ArrowButton } from "./Components/ArrowButton"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { MediumPicker } from "./Components/MediumPicker"
import { SizePicker } from "./Components/SizePicker"

export const MyCollectionAddArtwork: React.FC = () => {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const navActions = useStoreActions(actions => actions.navigation)
  const artworkState = useStoreState(state => state.artwork)
  const { formik } = useArtworkForm()
  const photos = artworkState.formValues.photos

  return (
    <Box>
      <FancyModalHeader backButtonText="Cancel" onBackPress={() => artworkActions.cancelAddEditArtwork()}>
        Add artwork
      </FancyModalHeader>

      <Spacer my={1} />

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

      {/* FIXME: BorderBox has side borders which are visible on side of screen. Need to replace */}
      <BorderBox px={0}>
        <ScreenMargin>
          <ArrowButton onPress={() => navActions.navigateToAddArtworkPhotos()}>
            <Flex flexDirection="row">
              <Sans size="3" weight="medium">
                Photos
              </Sans>
              <Sans size="3" ml="2px">
                (optional)
              </Sans>
            </Flex>
            {photos.length > 0 && (
              <>
                {photos.length === 1 ? (
                  <Sans size="3">1 photo added</Sans>
                ) : (
                  <Sans size="3">{photos.length} photos added</Sans>
                )}
              </>
            )}
          </ArrowButton>
        </ScreenMargin>
      </BorderBox>

      <BorderBox px={0} position="relative" top={-1}>
        <ScreenMargin>
          <ArrowButton onPress={() => navActions.navigateToAddTitleAndYear()}>
            <Flex flexDirection="row">
              <Sans size="3" weight="medium">
                Title & year
              </Sans>
              <Sans size="3" ml="2px">
                (optional)
              </Sans>
            </Flex>
          </ArrowButton>
        </ScreenMargin>
      </BorderBox>

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
