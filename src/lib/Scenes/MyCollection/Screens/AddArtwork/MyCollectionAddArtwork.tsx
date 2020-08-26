import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { BorderBox, Box, Button, Flex, Join, Sans, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { ArrowButton } from "./Components/ArrowButton"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { MediumPicker } from "./Components/MediumPicker"
import { SizePicker } from "./Components/SizePicker"

export const MyCollectionAddArtwork: React.FC = () => {
  const artworkActions = AppStore.actions.myCollection.artwork
  const navActions = AppStore.actions.myCollection.navigation
  const artworkState = AppStore.useAppState(state => state.myCollection.artwork)
  const { formik } = useArtworkForm()
  const photos = artworkState.sessionState.formValues.photos
  const formattedTitleAndYear = [formik.values.title, formik.values.year].filter(Boolean).join(", ")

  return (
    <ScrollView>
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
            {!!formattedTitleAndYear && <Sans size="3">{formattedTitleAndYear}</Sans>}
          </ArrowButton>
        </ScreenMargin>
      </BorderBox>

      <Spacer my={2} />

      <ScreenMargin>
        <Button disabled={!formik.isValid} block onPress={formik.handleSubmit}>
          Complete
        </Button>
      </ScreenMargin>

      {/* Show validation errors during development */}
      {!!(__DEV__ && formik.errors) && (
        <ScreenMargin>
          <Box my={2}>
            <Sans size="3">Errors: {JSON.stringify(formik.errors)}</Sans>
          </Box>
        </ScreenMargin>
      )}
    </ScrollView>
  )
}
