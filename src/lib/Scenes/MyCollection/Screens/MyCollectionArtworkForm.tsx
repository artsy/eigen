import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AppStore } from "lib/store/AppStore"
import { isEmpty } from "lodash"
import { BorderBox, Box, Button, Flex, Join, Sans, Spacer } from "palette"
import React, { useState } from "react"
import { ActivityIndicator, ScrollView } from "react-native"
import { ScreenMargin } from "../Components/ScreenMargin"
import { ArrowButton } from "./AddArtwork/Components/ArrowButton"
import { ArtistAutosuggest } from "./AddArtwork/Components/ArtistAutosuggest"
import { Dimensions } from "./AddArtwork/Components/Dimensions"
import { MediumPicker } from "./AddArtwork/Components/MediumPicker"
import { useArtworkForm } from "./AddArtwork/Form/useArtworkForm"

const SHOW_FORM_VALIDATION_ERRORS_IN_DEV = false

export const MyCollectionArtworkForm: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const artworkActions = AppStore.actions.myCollection.artwork
  const artworkState = AppStore.useAppState((state) => state.myCollection.artwork)
  const [loading, setLoading] = useState<boolean>(false)
  const navState = AppStore.useAppState((state) => state.myCollection.navigation)
  const { formik } = useArtworkForm()
  const modalType = navState?.sessionState?.modalType
  const addOrEditLabel = modalType === "edit" ? "Edit" : "Add"

  /* FIXME: Wire up proper loading modal */
  const submitArtwork = () => {
    /* `handleSubmit` is wired up in <Boot>  */
    setLoading(true)
    formik.handleSubmit()
  }

  const showLoading = loading && !artworkState.sessionState.artworkErrorOccurred

  const deletionStarted = () => {
    setLoading(true)
  }

  return (
    // <Flex>
    //   <FancyModalHeader>Form {(route.params as any).mode}</FancyModalHeader>
    //   <Button
    //     onPress={() => {
    //       navigation.navigate("ArtworkDetailsForm")
    //     }}
    //   >
    //     Additional details
    //   </Button>
    //   <Button>{(route.params as any).mode === "add" ? "Submit" : "Update"}</Button>
    // </Flex>
    <>
      {/* Disable touch events in form while loading */}
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => (route.params as any).onDismiss()}>
        {addOrEditLabel} artwork
      </FancyModalHeader>
      <ScrollView
        pointerEvents={showLoading ? "none" : "auto"}
        keyboardDismissMode={"on-drag"}
        keyboardShouldPersistTaps={"handled"}
      >
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

        <PhotosButton
          onPress={() => {
            if (isEmpty(artworkState.sessionState.formValues.photos)) {
              artworkActions.takeOrPickPhotos()
            } else {
              navigation.navigate("AddPhotos")
            }
          }}
        />
        <AdditionalDetailsButton
          onPress={() => {
            navigation.navigate("ArtworkDetailsForm")
          }}
        />

        <Spacer my={2} />

        <ScreenMargin>
          <Button disabled={!formik.isValid} block onPress={submitArtwork} data-test-id="CompleteButton">
            Complete
          </Button>

          {modalType === "edit" && (
            <Button
              mt={2}
              variant="secondaryGray"
              block
              onPress={() =>
                artworkActions.confirmDeleteArtwork({
                  artworkId: artworkState.sessionState.artworkId,
                  artworkGlobalId: artworkState.sessionState.artworkGlobalId,
                  startedLoading: deletionStarted,
                })
              }
              data-test-id="DeleteButton"
            >
              Delete
            </Button>
          )}
          <Spacer mt={4} />
        </ScreenMargin>

        {/* Show validation errors during development */}
        {!!(SHOW_FORM_VALIDATION_ERRORS_IN_DEV && __DEV__ && formik.errors) && (
          <ScreenMargin>
            <Box my={2}>
              <Sans size="3">Errors: {JSON.stringify(formik.errors)}</Sans>
            </Box>
          </ScreenMargin>
        )}
      </ScrollView>
      {showLoading && <LoadingIndicator />}
    </>
  )
}

const LoadingIndicator = () => {
  return (
    <Box
      style={{
        zIndex: 100,
        height: "100%",
        width: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </Flex>
    </Box>
  )
}

const PhotosButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const artworkState = AppStore.useAppState((state) => state.myCollection.artwork)
  const photos = artworkState.sessionState.formValues.photos

  return (
    <BorderBox px={0} top={-1}>
      <ScreenMargin>
        <ArrowButton onPress={onPress}>
          <Flex flexDirection="row">
            <Sans size="3" weight="medium">
              Photos
            </Sans>
          </Flex>
          {photos.length > 0 && (
            <>
              {photos.length === 1 ? (
                <Sans size="3" data-test-id="onePhoto">
                  1 photo added
                </Sans>
              ) : (
                <Sans size="3" data-test-id="multiplePhotos">
                  {photos.length} photos added
                </Sans>
              )}
            </>
          )}
        </ArrowButton>
      </ScreenMargin>
    </BorderBox>
  )
}

const AdditionalDetailsButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <BorderBox px={0} position="relative" top={-2}>
      <ScreenMargin>
        <ArrowButton onPress={onPress}>
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
  )
}
