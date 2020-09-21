import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import { AppStore } from "lib/store/AppStore"
import { BorderBox, Box, Button, Flex, Join, Sans, Spacer } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { ArrowButton } from "./Components/ArrowButton"
import { ArtistAutosuggest } from "./Components/ArtistAutosuggest"
import { Dimensions } from "./Components/Dimensions"
import { MediumPicker } from "./Components/MediumPicker"

export const AddEditArtwork: React.FC = () => {
  const artworkActions = AppStore.actions.myCollection.artwork
  const navActions = AppStore.actions.myCollection.navigation
  const artworkState = AppStore.useAppState((state) => state.myCollection.artwork)
  const navState = AppStore.useAppState((state) => state.myCollection.navigation)
  const { formik } = useArtworkForm()
  const photos = artworkState.sessionState.formValues.photos
  const modalType = navState?.sessionState?.modalType
  const addOrEditLabel = modalType ? "Edit" : "Add"

  return (
    <ScrollView>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => artworkActions.cancelAddEditArtwork()}>
        {addOrEditLabel} artwork
      </FancyModalHeader>

      <Spacer my={1} />

      <Sans size="4" textAlign="center">
        {addOrEditLabel} details about your work for a price {"\n"}
        evaluation and market insights.
      </Sans>

      <ScreenMargin>
        <Join separator={<Spacer my={1} />}>
          <ArtistAutosuggest />
          <MediumPicker />
          <Dimensions />
        </Join>
      </ScreenMargin>

      <Spacer my={2} />

      <BorderBox px={0} top={-1}>
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

      <BorderBox px={0} position="relative" top={-2}>
        <ScreenMargin>
          <ArrowButton onPress={() => navActions.navigateToAddAdditionalDetails()}>
            <Flex flexDirection="row">
              <Sans size="3" weight="medium">
                Additional details
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
        {/* `handleSubmit` is wired up in <Boot>  */}
        <Button disabled={!formik.isValid} block onPress={formik.handleSubmit}>
          Complete
        </Button>

        {modalType === "edit" && (
          <Button
            variant="secondaryGray"
            block
            onPress={() =>
              artworkActions.deleteArtwork({
                artworkId: artworkState.sessionState.artworkId,
                artworkGlobalId: artworkState.sessionState.artworkGlobalId,
              })
            }
          >
            Delete
          </Button>
        )}
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
