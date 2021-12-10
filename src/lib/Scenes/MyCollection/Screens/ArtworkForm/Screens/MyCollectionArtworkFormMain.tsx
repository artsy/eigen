import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { isEmpty } from "lodash"
import { Box, Button, Flex, Join, Sans, Separator, Spacer, Text } from "palette"
import React from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArrowDetails } from "../Components/ArrowDetails"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { Dimensions } from "../Components/Dimensions"
import { MediumPicker } from "../Components/MediumPicker"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

const SHOW_FORM_VALIDATION_ERRORS_IN_DEV = false

export const MyCollectionArtworkFormMain: React.FC<StackScreenProps<ArtworkFormScreen, "ArtworkForm">> = ({
  navigation,
  route,
}) => {
  const artworkActions = GlobalStore.actions.myCollection.artwork
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const { formik } = useArtworkForm()
  const { showActionSheetWithOptions } = useActionSheet()
  const modalType = route.params.mode
  const addOrEditLabel = modalType === "edit" ? "Edit" : "Add"

  const isFormDirty = () => {
    // if you fill an empty field then delete it again, it changes from null to ""
    const isEqual = (aVal: any, bVal: any) =>
      (aVal === "" || aVal === null) && (bVal === "" || bVal === null) ? true : aVal === bVal
    const { formValues, dirtyFormCheckValues } = artworkState.sessionState
    return Object.getOwnPropertyNames(dirtyFormCheckValues).reduce(
      (accum: boolean, key: string) =>
        accum ||
        !isEqual((formValues as { [key: string]: any })[key], (dirtyFormCheckValues as { [key: string]: any })[key]),
      false
    )
  }

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText={isFormDirty() ? "Clear" : undefined}
        onRightButtonPress={isFormDirty() ? () => route.params.clearForm() : undefined}
      >
        {addOrEditLabel} Artwork
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Spacer my={1} />
        <Text textAlign="center">
          {addOrEditLabel} details about your artwork to access {"\n"}
          price and market insights.
        </Text>
        <Spacer my="1" />
        <ScreenMargin>
          <Join separator={<Spacer my={1} />}>
            <ArtistAutosuggest />
            <MediumPicker />
            <Dimensions />
          </Join>
        </ScreenMargin>

        <Spacer my={2} />

        <PhotosButton
          testID="PhotosButton"
          onPress={() => {
            if (isEmpty(artworkState.sessionState.formValues.photos)) {
              showPhotoActionSheet(showActionSheetWithOptions, true).then((photos) => {
                artworkActions.addPhotos(photos)
              })
            } else {
              navigation.navigate("AddPhotos", { onHeaderBackButtonPress: route.params.onHeaderBackButtonPress })
            }
          }}
        />
        <AdditionalDetailsButton
          testID="AdditionalDetailsButton"
          onPress={() => {
            navigation.navigate("AdditionalDetails", { onHeaderBackButtonPress: route.params.onHeaderBackButtonPress })
          }}
        />

        <Spacer mt={2} mb={1} />

        <ScreenMargin>
          <Button
            disabled={!formik.isValid || !isFormDirty()}
            block
            onPress={formik.handleSubmit}
            testID="CompleteButton"
            haptic
          >
            {modalType === "edit" ? "Save changes" : "Complete"}
          </Button>

          {modalType === "edit" && (
            <Button
              mt={1}
              variant="outline"
              block
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    title: "Delete artwork?",
                    options: ["Delete", "Cancel"],
                    destructiveButtonIndex: 0,
                    cancelButtonIndex: 1,
                    useModal: true,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      route.params.onDelete?.()
                    }
                  }
                )
              }}
              testID="DeleteButton"
            >
              Delete artwork
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
    </>
  )
}

const PhotosButton: React.FC<{ onPress: () => void; testID?: string }> = ({ onPress, testID }) => {
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const photos = artworkState.sessionState.formValues.photos

  return (
    <>
      <Separator />
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Spacer mt={2} />
        <ScreenMargin>
          <ArrowDetails>
            <Flex flexDirection="row">
              <Text variant="xs">PHOTOS</Text>
            </Flex>
            {photos.length > 0 && (
              <>
                {photos.length === 1 ? (
                  <Text variant="xs" testID="onePhoto">
                    1 photo added
                  </Text>
                ) : (
                  <Text variant="xs" testID="multiplePhotos">
                    {photos.length} photos added
                  </Text>
                )}
              </>
            )}
          </ArrowDetails>
        </ScreenMargin>
        <Spacer mb={2} />
      </TouchableOpacity>
      <Separator />
    </>
  )
}

const AdditionalDetailsButton: React.FC<{ onPress: () => void; testID?: string }> = ({ onPress, testID }) => {
  return (
    <>
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Spacer mt={2} />
        <ScreenMargin>
          <ArrowDetails>
            <Flex flexDirection="row">
              <Text variant="xs">ADDITIONAL DETAILS</Text>
            </Flex>
          </ArrowDetails>
        </ScreenMargin>
        <Spacer mb={2} />
      </TouchableOpacity>
      <Separator />
    </>
  )
}
