import {
  Spacer,
  Flex,
  Box,
  useSpace,
  useColor,
  Text,
  Separator,
  Join,
  Message,
  Button,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Input } from "app/Components/Input"
import { MoneyInput } from "app/Components/Input/MoneyInput"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArrowDetails } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArrowDetails"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { Dimensions } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions"
import { Rarity } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Rarity"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { Currency } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { isEmpty } from "lodash"
import React, { useEffect, useState } from "react"
import { Alert, Image, ScrollView, TouchableOpacity } from "react-native"

const SHOW_FORM_VALIDATION_ERRORS_IN_DEV = false

export const MyCollectionArtworkFormMain: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormMain">
> = ({ route, navigation }) => {
  const enableNotesField = useFeatureFlag("AREnableMyCollectionNotesField")

  const artworkActions = GlobalStore.actions.myCollection.artwork
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const { formik } = useArtworkForm()
  const color = useColor()
  const space = useSpace()

  const { showActionSheetWithOptions } = useActionSheet()
  const modalType = route.params.mode
  const addOrEditLabel = modalType === "edit" ? "Edit" : "Add"
  const formikValues = formik?.values
  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const initialCurrency = formikValues.pricePaidCurrency?.length
    ? formikValues.pricePaidCurrency
    : preferredCurrency

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
                GlobalStore.actions.myCollection.artwork.resetForm()
                navigation.dispatch(e.data.action)
              },
            },
          ]
        )
      } else {
        GlobalStore.actions.myCollection.artwork.resetForm()
        navigation.dispatch(e.data.action)
      }
    })
    return backListener
  }, [
    navigation,
    artworkState.sessionState.formValues,
    artworkState.sessionState.dirtyFormCheckValues,
  ])

  const enableMoneyFormatting = useFeatureFlag("AREnableMoneyFormattingInMyCollectionForm")

  const isFormDirty = () => {
    const { formValues, dirtyFormCheckValues } = artworkState.sessionState

    // Check if any fields are filled out when adding a new artwork
    if (modalType === "add") {
      return Object.getOwnPropertyNames(formValues).find(
        (key) =>
          !["pricePaidCurrency", "metric", "photos"].includes(key) &&
          !key.startsWith("artist") &&
          (formValues as { [key: string]: any })[key]
      )

      // Check if any fields are different from the original values when editing an artwork
    } else {
      // if you fill an empty field then delete it again, it changes from null to ""
      const isEqual = (aVal: any, bVal: any) =>
        (aVal === "" || aVal === null) && (bVal === "" || bVal === null) ? true : aVal === bVal

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
  }

  const handleCategory = (category: string) => {
    formik.handleChange("category")(category)
  }

  return (
    <>
      <ArtsyKeyboardAvoidingView>
        <FancyModalHeader
          onLeftButtonPress={
            isFormDirty() && modalType === "edit"
              ? () => setShowAbandonModal(true)
              : route.params.onHeaderBackButtonPress
          }
          rightButtonText={isFormDirty() ? "Clear" : undefined}
          onRightButtonPress={isFormDirty() ? () => route.params.clearForm() : undefined}
          hideBottomDivider
        >
          {addOrEditLabel} Details
        </FancyModalHeader>

        <AbandonFlowModal
          isVisible={showAbandonModal && modalType === "edit"}
          title="Leave without saving?"
          subtitle="Changes you have made so far will not be saved."
          leaveButtonTitle="Leave Without Saving"
          continueButtonTitle="Continue Editing"
          onDismiss={() => setShowAbandonModal(false)}
        />

        <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
          {!!route.params.isSubmission && (
            <Message
              containerStyle={{ mx: `${space(2)}px` }}
              title="Changes will only appear in My Collection. They will not be applied to your sale submission."
              IconComponent={() => (
                <Image
                  source={require("images/info.webp")}
                  style={{ tintColor: color("black100") }}
                />
              )}
            />
          )}

          <Flex p={2}>
            <Join separator={<Spacer y={1} />}>
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
              <CategoryPicker<string>
                value={formikValues.category}
                options={artworkMediumCategories}
                handleChange={handleCategory}
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
              <Input
                title="Materials"
                placeholder="Materials"
                onChangeText={formik.handleChange("medium")}
                onBlur={formik.handleBlur("medium")}
                testID="MaterialsInput"
                accessibilityLabel="Materials"
                value={formikValues.medium}
              />
              <Rarity />
              <Dimensions />
              <MoneyInput
                accessibilityLabel="Price paid"
                currencyTextVariant="xs"
                format={enableMoneyFormatting}
                initialValues={{
                  currency: initialCurrency as Currency,
                  amount: formikValues.pricePaidDollars,
                }}
                keyboardType="decimal-pad"
                onChange={(values) => {
                  formik.handleChange("pricePaidDollars")(values.amount ?? "")
                  formik.handleChange("pricePaidCurrency")(values.currency ?? "")
                  GlobalStore.actions.userPrefs.setCurrency(values.currency as Currency)
                }}
                placeholder="Price paid"
                shouldDisplayLocalError={false}
                title="Price Paid"
              />
              <Input
                multiline
                title="Provenance"
                maxLength={500}
                placeholder="Describe how you acquired the artwork"
                value={formikValues.provenance}
                accessibilityLabel="Describe how you acquired the artwork"
                onChangeText={formik.handleChange("provenance")}
                testID="ProvenanceInput"
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
              {!!enableNotesField && (
                <Input
                  multiline
                  maxLength={500}
                  title="Notes"
                  onChangeText={formik.handleChange("confidentialNotes")}
                  onBlur={formik.handleBlur("confidentialNotes")}
                  testID="NotesInput"
                  accessibilityLabel="Notes"
                  value={formikValues.confidentialNotes}
                />
              )}
            </Join>
          </Flex>

          <Spacer y={1} />

          <PhotosButton
            testID="PhotosButton"
            onPress={() => {
              if (isEmpty(artworkState.sessionState.formValues.photos)) {
                showPhotoActionSheet(showActionSheetWithOptions, true).then((photos) => {
                  artworkActions.addPhotos(photos)
                })
              } else {
                requestAnimationFrame(() => {
                  navigation.navigate("AddPhotos")
                })
              }
            }}
          />

          <Spacer y={2} />

          <ScreenMargin>
            {modalType === "edit" && (
              <Text
                my={4}
                variant="sm"
                underline
                color={color("red100")}
                textAlign="center"
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
              </Text>
            )}
          </ScreenMargin>

          {/* Show validation errors during development */}
          {!!(SHOW_FORM_VALIDATION_ERRORS_IN_DEV && __DEV__ && formik.errors) && (
            <ScreenMargin>
              <Box my={2}>
                <Text variant="sm">Errors: {JSON.stringify(formik.errors)}</Text>
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

const PhotosButton: React.FC<{ onPress: () => void; testID?: string }> = ({ onPress, testID }) => {
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const photos = artworkState.sessionState.formValues.photos

  return (
    <>
      <Separator />
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Spacer y={2} />
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
        <Spacer y={2} />
      </TouchableOpacity>
      <Separator />
    </>
  )
}
