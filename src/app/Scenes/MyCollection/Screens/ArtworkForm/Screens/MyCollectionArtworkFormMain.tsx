import { ActionType, ContextModule, DeleteCollectedArtwork, OwnerType } from "@artsy/cohesion"
import {
  Box,
  Button,
  Flex,
  Input,
  Join,
  Separator,
  Spacer,
  Text,
  useColor,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { MoneyInput } from "app/Components/Input/MoneyInput"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ScreenMargin } from "app/Scenes/MyCollection/Components/ScreenMargin"
import { ArrowDetails } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArrowDetails"
import { ArtistCustomArtist } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistCustomArtist"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { Dimensions } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions"
import { MyCollectionArtworkFormDeleteArtworkModal } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/MyCollectionArtworkFormDeleteArtworkModal"
import { Rarity } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Rarity"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import { deleteUserInterest } from "app/Scenes/MyCollection/mutations/deleteUserInterest"
import { myCollectionDeleteArtwork } from "app/Scenes/MyCollection/mutations/myCollectionDeleteArtwork"
import { Currency } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { dismissModal, goBack, popToRoot } from "app/system/navigation/navigate"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { LocationWithDetails } from "app/utils/googleMaps"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { isEmpty } from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"

const SHOW_FORM_VALIDATION_ERRORS_IN_DEV = false

export const MyCollectionArtworkFormMain: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormMain">
> = ({ navigation }) => {
  const { trackEvent } = useTracking()

  const artworkActions = GlobalStore.actions.myCollection.artwork
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)

  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const [showDeleteArtistModal, setShowDeleteArtistModal] = useState(false)

  const { formik } = useArtworkForm()
  const color = useColor()

  const { showActionSheetWithOptions } = useActionSheet()

  const { mode, artwork } = MyCollectionArtworkStore.useStoreState((state) => state)

  const addOrEditLabel = mode === "edit" ? "Edit" : "Add"
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
                if (mode === "edit" || !formikValues.artistSearchResult) {
                  GlobalStore.actions.myCollection.artwork.resetForm()
                } else {
                  GlobalStore.actions.myCollection.artwork.resetFormButKeepArtist()
                }
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

  const isFormDirty = useCallback(() => {
    const { formValues, dirtyFormCheckValues } = artworkState.sessionState

    // Check if any fields are filled out when adding a new artwork
    if (mode === "add") {
      return Object.getOwnPropertyNames(formValues).find(
        (key) =>
          !["pricePaidCurrency", "metric", "photos", "customArtist"].includes(key) &&
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
  }, [
    JSON.stringify(artworkState.sessionState.formValues),
    JSON.stringify(artworkState.sessionState.dirtyFormCheckValues),
  ])

  const clearForm = async () => {
    const { dirtyFormCheckValues } = artworkState.sessionState

    const formIsDirty = isFormDirty()

    if (formIsDirty) {
      const discardData = await new Promise((resolve) =>
        showActionSheetWithOptions(
          {
            title: "Do you want to discard your changes?",
            options: ["Discard", "Keep editing"],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
            useModal: true,
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              resolve(true)
            }
          }
        )
      )

      if (!discardData) {
        return
      }
    }

    if (mode === "edit") {
      // Reset the form with the initial values from the artwork
      GlobalStore.actions.myCollection.artwork.updateFormValues(dirtyFormCheckValues)
    } else {
      GlobalStore.actions.myCollection.artwork.resetFormButKeepArtist()
    }
  }

  const handleCategory = (category: string) => {
    formik.handleChange("category")(category)
  }

  const handleBackButtonPress = () => {
    if (mode === "edit") {
      goBack()
    } else {
      navigation.goBack()
    }
  }
  // To make the location input auto-suggestion dropdown visible when the keyboard is up,
  // we scroll the y position of the location input to move it to the top of the screen.
  const [locationInputYCoordinate, setLocationInputYCoordinate] = useState<number>(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const scrollToLocationInput = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: locationInputYCoordinate })
  }, [locationInputYCoordinate])

  const deleteArtwork = async (shouldDeleteArtist?: boolean) => {
    if (!artwork) return

    trackEvent(tracks.deleteCollectedArtwork(artwork.internalID, artwork?.slug))
    try {
      // TODO: Fix this separetely
      if (!__TEST__) {
        await myCollectionDeleteArtwork(artwork.internalID)
      }

      if (shouldDeleteArtist && formikValues.artistSearchResult?.internalID) {
        await deleteUserInterest({
          id: formikValues.artistSearchResult.internalID,
        })

        setShowDeleteArtistModal(false)
      }
      refreshMyCollection()
      dismissModal()
      popToRoot()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureMessage(`deleteArtwork ${JSON.stringify(e)}`)
      }
      Alert.alert("An error ocurred", typeof e === "string" ? e : undefined)
    }
  }

  const { bottom } = useScreenDimensions().safeAreaInsets

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {formikValues.artistSearchResult?.internalID ? (
          <MyCollectionArtworkFormDeleteArtworkModal
            visible={showDeleteArtistModal}
            hideModal={() => setShowDeleteArtistModal(false)}
            deleteArtwork={deleteArtwork}
            artistID={formikValues.artistSearchResult.internalID}
          />
        ) : null}

        <NavigationHeader
          onLeftButtonPress={() => {
            if (isFormDirty() && mode === "edit") {
              setShowAbandonModal(true)
            } else {
              handleBackButtonPress()
            }
          }}
          rightButtonText={isFormDirty() ? "Clear" : undefined}
          onRightButtonPress={
            isFormDirty()
              ? () => {
                  clearForm()
                }
              : undefined
          }
          hideBottomDivider
        >
          {addOrEditLabel} Details
        </NavigationHeader>

        <AbandonFlowModal
          isVisible={!!showAbandonModal && mode === "edit"}
          title="Leave without saving?"
          subtitle="Changes you have made so far will not be saved."
          leaveButtonTitle="Leave Without Saving"
          continueButtonTitle="Continue Editing"
          onDismiss={() => setShowAbandonModal(false)}
          onLeave={handleBackButtonPress}
        />

        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          <Flex style={{ paddingBottom: 160 }}>
            <Flex p={2}>
              <Join separator={<Spacer y={2} />}>
                <ArtistField />

                <Input
                  title="Title"
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
                  placeholder="Oil on canvas, mixed media, lithograph.."
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
                  format
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
                  showLimit
                  placeholder="Describe how you acquired the artwork"
                  value={formikValues.provenance}
                  accessibilityLabel="Describe how you acquired the artwork"
                  onChangeText={formik.handleChange("provenance")}
                  testID="ProvenanceInput"
                />

                <Box
                  onLayout={({ nativeEvent }) => {
                    setLocationInputYCoordinate(nativeEvent.layout.y)
                  }}
                >
                  <LocationAutocomplete
                    allowCustomLocation
                    title="Location"
                    testID="LocationInput"
                    placeholder="Enter city where artwork is located"
                    displayLocation={buildLocationDisplay(formikValues.collectorLocation)}
                    onFocus={scrollToLocationInput}
                    onChange={(location: LocationWithDetails) => {
                      formik.setFieldValue("collectorLocation", {
                        city: location.city,
                        state: location.state,
                        country: location.country,
                        countryCode: location.countryCode,
                      })
                    }}
                    accessibilityLabel="Enter city where the artwork is located"
                  />
                </Box>

                <Input
                  multiline
                  maxLength={500}
                  showLimit
                  title="Notes"
                  onChangeText={formik.handleChange("confidentialNotes")}
                  onBlur={formik.handleBlur("confidentialNotes")}
                  testID="NotesInput"
                  accessibilityLabel="Notes"
                  value={formikValues.confidentialNotes}
                />
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
              {mode === "edit" && !!artwork && (
                <Text
                  my={4}
                  variant="sm"
                  underline
                  color={color("red100")}
                  textAlign="center"
                  onPress={() => setShowDeleteArtistModal(true)}
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
          </Flex>
        </ScrollView>

        <Flex p={2} pb={Platform.OS === "android" ? 2 : 0}>
          <Button
            disabled={!formik.isValid || !isFormDirty()}
            block
            onPress={formik.handleSubmit}
            testID="CompleteButton"
            haptic
            mb={`${bottom}px`}
          >
            {mode === "edit" ? "Save changes" : "Complete"}
          </Button>
        </Flex>
      </KeyboardAvoidingView>
    </>
  )
}

const ArtistField: React.FC = () => {
  const { formik } = useArtworkForm()

  if (formik.values.artistSearchResult) {
    return <ArtistSearchResult result={formik.values.artistSearchResult} />
  } else if (formik.values.customArtist) {
    return <ArtistCustomArtist artist={formik.values.customArtist} />
  } else
    return (
      <Input
        title="Artist"
        placeholder="Artist"
        onChangeText={formik.handleChange("artistDisplayName")}
        onBlur={formik.handleBlur("artistDisplayName")}
        testID="ArtistDisplayNameInput"
        required
        accessibilityLabel="Artist Name"
        value={formik.values.artistDisplayName}
      />
    )
}

const PhotosButton: React.FC<{ onPress: () => void; testID?: string }> = ({ onPress, testID }) => {
  const artworkState = GlobalStore.useAppState((state) => state.myCollection.artwork)
  const photos = artworkState.sessionState.formValues.photos

  return (
    <>
      <Separator />
      <TouchableOpacity accessibilityRole="button" onPress={onPress} testID={testID}>
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

const tracks = {
  deleteCollectedArtwork: (internalID: string, slug: string): DeleteCollectedArtwork => ({
    action: ActionType.deleteCollectedArtwork,
    context_module: ContextModule.myCollectionArtwork,
    context_owner_id: internalID,
    context_owner_slug: slug,
    context_owner_type: OwnerType.myCollectionArtwork,
    platform: "mobile",
  }),
}
