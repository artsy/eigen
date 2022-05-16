import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Currency } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { isEmpty } from "lodash"
import { Box, Button, Flex, Input, Join, Sans, Separator, Spacer, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useEffect } from "react"
import { Alert, ScrollView, TouchableOpacity } from "react-native"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArrowDetails } from "../Components/ArrowDetails"
import { ArtistSearchResult } from "../Components/ArtistSearchResult"
import { Dimensions } from "../Components/Dimensions"
import { MediumPicker } from "../Components/MediumPicker"
import { Rarity } from "../Components/Rarity"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

const SHOW_FORM_VALIDATION_ERRORS_IN_DEV = false

export const MyCollectionArtworkFormMain: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormMain">
> = ({ route, navigation }) => {
  const artworkActions = GlobalStore.actions.myCollection.artwork
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const { formik } = useArtworkForm()
  const { showActionSheetWithOptions } = useActionSheet()
  const modalType = route.params.mode
  const addOrEditLabel = modalType === "edit" ? "Edit" : "Add"
  const formikValues = formik?.values

  useEffect(() => {
    const isDirty = isFormDirty()
    const backListener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault()
      if (isDirty) {
        Alert.alert(
          "Do you want to discard your changes?",
          "Leaving this screen will discard any changes you have made on this form.",
          [
            { text: "Keep editing", style: "cancel", onPress: () => null },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => {
                GlobalStore.actions.myCollection.artwork.resetFormButKeepArtist()
                navigation.dispatch(e.data.action)
              },
            },
          ]
        )
      } else {
        navigation.dispatch(e.data.action)
      }
    })
    return backListener
  }, [navigation, artworkState.sessionState.dirtyFormCheckValues])

  const isFormDirty = () => {
    // if you fill an empty field then delete it again, it changes from null to ""
    const isEqual = (aVal: any, bVal: any) =>
      (aVal === "" || aVal === null) && (bVal === "" || bVal === null) ? true : aVal === bVal
    const { formValues, dirtyFormCheckValues } = artworkState.sessionState
    return Object.getOwnPropertyNames(dirtyFormCheckValues).reduce(
      (accum: boolean, key: string) =>
        accum ||
        !isEqual(
          (formValues as { [key: string]: any })[key],
          (dirtyFormCheckValues as { [key: string]: any })[key]
        ),
      false
    )
  }

  return (
    <>
      <ArtsyKeyboardAvoidingView>
        <FancyModalHeader
          onLeftButtonPress={route.params.onHeaderBackButtonPress}
          rightButtonText={isFormDirty() ? "Clear" : undefined}
          onRightButtonPress={isFormDirty() ? () => route.params.clearForm() : undefined}
          hideBottomDivider
        >
          {addOrEditLabel} Details
        </FancyModalHeader>
        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          <Flex p={2}>
            <Join separator={<Spacer my={1} />}>
              {formik.values.artistSearchResult ? (
                <ArtistSearchResult result={formik.values.artistSearchResult} />
              ) : (
                <Input
                  title="Artist"
                  placeholder="Artist"
                  onChangeText={formik.handleChange("artistDisplayName")}
                  onBlur={formik.handleBlur("artistDisplayName")}
                  testID="ArtistDisplayNameInput"
                  required
                  accessibilityLabel="Artist Name"
                  value={formikValues.artistDisplayName}
                />
              )}
              <Input
                title="Title"
                placeholder="Title"
                onChangeText={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                testID="TitleInput"
                required
                accessibilityLabel="Title"
                value={formikValues.title}
              />
              <Input
                title="Year"
                keyboardType="number-pad"
                placeholder="Year created"
                onChangeText={formik.handleChange("date")}
                onBlur={formik.handleBlur("date")}
                testID="DateInput"
                accessibilityLabel="Year"
                value={formikValues.date}
              />
              <MediumPicker />
              <Input
                title="Materials"
                placeholder="Materials"
                onChangeText={formik.handleChange("category")}
                onBlur={formik.handleBlur("category")}
                testID="MaterialsInput"
                accessibilityLabel="Materials"
                value={formikValues.category}
              />
              <Rarity />
              <Dimensions />
              <Input
                title="Price Paid"
                placeholder="Price paid"
                keyboardType="decimal-pad"
                accessibilityLabel="Price paid"
                onChangeText={formik.handleChange("pricePaidDollars")}
                onBlur={formik.handleBlur("pricePaidDollars")}
                testID="PricePaidInput"
                value={formikValues.pricePaidDollars}
              />
              <Select
                title="Currency"
                placeholder="Currency"
                options={pricePaidCurrencySelectOptions}
                value={formikValues.pricePaidCurrency}
                enableSearch={false}
                showTitleLabel={false}
                onSelectValue={(value) => {
                  formik.handleChange("pricePaidCurrency")(value)
                  GlobalStore.actions.userPrefs.setCurrency(value as Currency)
                }}
                testID="CurrencyPicker"
              />
              <Input
                title="Location"
                placeholder="Enter city where artwork is located"
                onChangeText={formik.handleChange("artworkLocation")}
                onBlur={formik.handleBlur("artworkLocation")}
                testID="LocationInput"
                accessibilityLabel="Enter city where the artwork is located"
                value={formikValues.artworkLocation}
              />
              <Input
                multiline
                title="Provenance"
                placeholder="Describe how you acquired the artwork"
                value={formikValues.provenance}
                accessibilityLabel="Describe how you acquired the artwork"
                onChangeText={formik.handleChange("provenance")}
                testID="ProvenanceInput"
              />
            </Join>
          </Flex>

          <Spacer mt={1} />

          <PhotosButton
            testID="PhotosButton"
            onPress={() => {
              if (isEmpty(artworkState.sessionState.formValues.photos)) {
                showPhotoActionSheet(showActionSheetWithOptions, true).then((photos) => {
                  artworkActions.addPhotos(photos)
                })
              } else {
                navigation.navigate("AddPhotos")
              }
            }}
          />

          <Spacer mt={2} mb={1} />

          <ScreenMargin>
            {modalType === "edit" && (
              <Button
                my={1}
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
      </ArtsyKeyboardAvoidingView>
      <Flex p={2}>
        <Button
          disabled={!formik.isValid || !isFormDirty()}
          block
          onPress={formik.handleSubmit}
          testID="CompleteButton"
          haptic
        >
          {modalType === "edit" ? "Save changes" : "Complete"}
        </Button>
      </Flex>
    </>
  )
}

const pricePaidCurrencySelectOptions: Array<{
  label: string
  value: Currency
}> = [
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
  { label: "£ GBP", value: "GBP" },
]

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
