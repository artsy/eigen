import {
  ActionType,
  ContextModule,
  DeleteCollectedArtwork,
  OwnerType,
  SaveCollectedArtwork,
} from "@artsy/cohesion"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { captureException } from "@sentry/react-native"
import { MyCollectionArtwork_sharedProps$data } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { LengthUnitPreference } from "__generated__/UserPrefsModelQuery.graphql"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { deleteArtworkImage } from "app/Scenes/MyCollection/mutations/deleteArtworkImage"
import { myCollectionCreateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionCreateArtwork"
import { myCollectionDeleteArtwork } from "app/Scenes/MyCollection/mutations/myCollectionDeleteArtwork"
import { myCollectionUpdateArtwork } from "app/Scenes/MyCollection/mutations/myCollectionUpdateArtwork"
import { deletedPhotos } from "app/Scenes/MyCollection/utils/deletedPhotos"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { storeLocalImage } from "app/utils/LocalImageStore"
import { addClue, setVisualClueAsSeen } from "app/utils/hooks/useVisualClue"
import { refreshMyCollection, refreshMyCollectionInsights } from "app/utils/refreshHelpers"
import { FormikProvider, useFormik } from "formik"
import { isEqual, reverse } from "lodash"
import { useEffect, useRef, useState } from "react"
import { Alert, InteractionManager } from "react-native"
import { useTracking } from "react-tracking"
import { SavingArtworkModal } from "./Components/SavingArtworkModal"
import { artworkSchema, validateArtworkSchema } from "./Form/artworkSchema"
import { uploadPhotos } from "./MyCollectionImageUtil"
import { MyCollectionAddPhotos } from "./Screens/MyCollectionArtworkFormAddPhotos"
import { MyCollectionArtworkFormArtist } from "./Screens/MyCollectionArtworkFormArtist"
import { MyCollectionArtworkFormArtwork } from "./Screens/MyCollectionArtworkFormArtwork"
import { MyCollectionArtworkFormMain } from "./Screens/MyCollectionArtworkFormMain"

export type ArtworkFormMode = "add" | "edit"

// This needs to be a `type` rather than an `interface` because there's
// a long-standing thing where a typescript `interface` will be treated a bit more strictly
// than the equivalent `type` in some situations.
// https://github.com/microsoft/TypeScript/issues/15300
// The react-navigation folks have written code that relies on the more permissive `type` behaviour.

export type ArtworkFormScreen = {
  ArtworkFormArtist: {
    mode: ArtworkFormMode
    clearForm(): void
    onDelete(): void
    onHeaderBackButtonPress(): void
  }
  ArtworkFormArtwork: {
    mode: ArtworkFormMode
    clearForm(): void
    onDelete(): void
    onHeaderBackButtonPress(): void
  }
  ArtworkFormMain: {
    mode: ArtworkFormMode
    isSubmission?: boolean
    clearForm(): void
    onDelete(): void
    onHeaderBackButtonPress(): void
  }
  AddPhotos: undefined
}

export type MyCollectionArtworkFormProps = { onSuccess?: () => void } & (
  | {
      mode: "add"
      source: Tab
    }
  | {
      mode: "edit"
      onDelete: () => void
      artwork: Omit<MyCollectionArtwork_sharedProps$data, " $refType">
    }
)

const navContainerRef = { current: null as NavigationContainerRef<any> | null }

export const MyCollectionArtworkForm: React.FC<MyCollectionArtworkFormProps> = (props) => {
  const { trackEvent } = useTracking()
  const { formValues, dirtyFormCheckValues } = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState
  )

  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  // we need to store the form values in a ref so that onDismiss can access their current value (prop updates are not
  // sent through the react-navigation system)
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const [loading, setLoading] = useState<boolean>(false)
  const [isArtworkSaved, setIsArtworkSaved] = useState<boolean>(false)
  const [savingArtworkModalDisplayText, setSavingArtworkModalDisplayText] = useState<string>("")

  const { showActionSheetWithOptions } = useActionSheet()

  const handleSubmit = async (values: ArtworkFormValues) => {
    if (loading) {
      return
    }

    setLoading(true)

    updateMyUserProfile({
      currencyPreference: preferredCurrency,
      lengthUnitPreference: preferredMetric.toUpperCase() as LengthUnitPreference,
    })

    try {
      await Promise.all([
        // This is to satisfy showing the insights modal for 2500 ms
        __TEST__ ? undefined : new Promise((resolve) => setTimeout(resolve, 2500)),
        updateArtwork(values, dirtyFormCheckValues, props).then((hasMarketPriceInsights) => {
          setSavingArtworkModalDisplayText(
            hasMarketPriceInsights ? "Generating market data" : "Saving artwork"
          )
        }),
      ])
    } catch (e) {
      __DEV__ ? console.error(e) : captureException(e)

      Alert.alert("Artwork could not be saved.", typeof e === "string" ? e : undefined)

      setLoading(false)

      return
    }

    try {
      // Adding tracking after a successfully adding an artwork
      if (props.mode === "add") {
        trackEvent(
          tracks.saveCollectedArtwork(
            values.artistIds[0],
            values.artistSearchResult?.targetSupply?.isP1
          )
        )
      }

      setIsArtworkSaved(true)
      // simulate requesting market data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      refreshMyCollection()
      refreshMyCollectionInsights({})
    } catch (e) {
      __DEV__ ? console.error(e) : captureException(e)
    }

    InteractionManager.runAfterInteractions(() => {
      props.onSuccess?.()
    })
  }

  useEffect(() => {
    return () => {
      GlobalStore.actions.myCollection.artwork.resetForm()
    }
  }, [])

  const formik = useFormik<ArtworkFormValues>({
    enableReinitialize: true,
    initialValues: formValues,
    initialErrors: validateArtworkSchema(formValues),
    onSubmit: handleSubmit,
    validationSchema: artworkSchema,
  })

  const onDelete =
    props.mode === "edit" && props.onDelete
      ? async () => {
          setLoading(true)
          trackEvent(tracks.deleteCollectedArtwork(props.artwork.internalID, props.artwork.slug))
          try {
            await myCollectionDeleteArtwork(props.artwork.internalID)
            refreshMyCollection()
            props.onDelete()
          } catch (e) {
            if (__DEV__) {
              console.error(e)
            } else {
              captureException(e)
            }
            Alert.alert("An error ocurred", typeof e === "string" ? e : undefined)
          } finally {
            setLoading(false)
          }
        }
      : undefined

  const clearForm = async () => {
    const formIsDirty = !isEqual(formValuesRef.current, dirtyFormCheckValues)

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

    if (props.mode === "edit") {
      // Reset the form with the initial values from the artwork
      GlobalStore.actions.myCollection.artwork.updateFormValues(dirtyFormCheckValues)
    } else {
      GlobalStore.actions.myCollection.artwork.resetFormButKeepArtist()
    }
  }

  const onHeaderBackButtonPress = () => {
    const currentRoute = navContainerRef.current?.getCurrentRoute()
    const isFirstScreen =
      props.mode === "edit" || !currentRoute?.name || currentRoute?.name === "ArtworkFormArtist"

    // clear and exit the form if we're on the first screen
    if (isFirstScreen) {
      GlobalStore.actions.myCollection.artwork.resetForm()
      goBack()
      return
    }

    navContainerRef.current?.goBack()
  }

  return (
    <NavigationContainer independent ref={navContainerRef}>
      <FormikProvider value={formik}>
        <Stack.Navigator
          // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
          detachInactiveScreens={false}
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "white" },
          }}
        >
          {props.mode === "add" && (
            <Stack.Screen
              name="ArtworkFormArtist"
              component={MyCollectionArtworkFormArtist}
              initialParams={{ onDelete, clearForm, onHeaderBackButtonPress }}
            />
          )}
          {props.mode === "add" && (
            <Stack.Screen
              name="ArtworkFormArtwork"
              component={MyCollectionArtworkFormArtwork}
              initialParams={{
                onDelete,
                clearForm,
                mode: props.mode,
                onHeaderBackButtonPress,
              }}
            />
          )}
          <Stack.Screen
            name="ArtworkFormMain"
            component={MyCollectionArtworkFormMain}
            initialParams={{
              onDelete,
              clearForm,
              mode: props.mode,
              onHeaderBackButtonPress,
              isSubmission: (() => {
                if (props.mode === "edit") {
                  return !!props.artwork.consignmentSubmission?.displayText
                }
                return false
              })(),
            }}
          />
          <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
        </Stack.Navigator>
        {props.mode === "add" ? (
          <SavingArtworkModal
            testID="saving-artwork-modal"
            isVisible={loading}
            loadingText={isArtworkSaved ? savingArtworkModalDisplayText : "Saving artwork"}
          />
        ) : (
          <LoadingModal testID="loading-modal" isVisible={loading} />
        )}
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormScreen>()

export const updateArtwork = async (
  values: ArtworkFormValues,
  dirtyFormCheckValues: ArtworkFormValues,
  props: MyCollectionArtworkFormProps
) => {
  const {
    photos,
    artistSearchResult,
    pricePaidDollars,
    pricePaidCurrency,
    artistDisplayName,
    ...others
  } = values

  const newPhotos = photos.filter((photo) => photo.path)
  const externalImageUrls = await uploadPhotos(newPhotos)

  let pricePaidCents
  if (pricePaidDollars && !isNaN(Number(pricePaidDollars))) {
    pricePaidCents = parseFloat(pricePaidDollars) * 100
  }

  if (values.attributionClass !== "LIMITED_EDITION") {
    others.editionNumber = ""
    others.editionSize = ""
  }

  if (props.mode === "add") {
    const response = await myCollectionCreateArtwork({
      artistIds: artistSearchResult?.internalID ? [artistSearchResult?.internalID] : undefined,
      artists: artistDisplayName ? [{ displayName: artistDisplayName }] : undefined,
      artworkLocation: others.artworkLocation,
      attributionClass: others.attributionClass || undefined,
      category: others.category,
      date: others.date,
      depth: others.depth,
      editionNumber: others.editionNumber,
      editionSize: others.editionSize,
      externalImageUrls,
      height: others.height,
      isEdition: others.isEdition,
      medium: others.medium,
      metric: others.metric,
      confidentialNotes: others.confidentialNotes,
      pricePaidCents,
      pricePaidCurrency,
      provenance: others.provenance,
      title: others.title,
      width: others.width,
    })

    const artwork = response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node

    // Store images locally
    await Promise.all(
      newPhotos.map(async (image, index) => {
        const imageID = artwork?.images?.[index]?.internalID

        if (!imageID) return

        await storeLocalImage(imageID, {
          path: image.path!,
          width: image.width!,
          height: image.height!,
        })
      })
    )

    const hasMarketPriceInsights =
      response.myCollectionCreateArtwork?.artworkOrError?.artworkEdge?.node?.hasMarketPriceInsights

    addArtworkMessages({ hasMarketPriceInsights, sourceTab: props.source })
    return hasMarketPriceInsights
  } else {
    const response = await myCollectionUpdateArtwork({
      artistIds: artistSearchResult?.internalID ? [artistSearchResult?.internalID] : [],
      artworkId: props.artwork.internalID,
      artworkLocation: others.artworkLocation,
      attributionClass: others.attributionClass || undefined,
      category: others.category,
      date: others.date,
      depth: others.depth,
      editionNumber: others.editionNumber,
      editionSize: others.editionSize,
      externalImageUrls,
      height: others.height,
      isEdition: others.isEdition,
      medium: others.medium,
      metric: others.metric,
      confidentialNotes: others.confidentialNotes,
      pricePaidCents: pricePaidCents ?? null,
      pricePaidCurrency,
      provenance: others.provenance,
      title: others.title,
      width: others.width,
    })

    const updatedArtwork = response.myCollectionUpdateArtwork?.artworkOrError?.artwork

    // Store images locally and start from the end because
    // it's only possible to add new images at the end
    const reversedImages = reverse([...(updatedArtwork?.images ?? [])])

    await Promise.all(
      reverse([...newPhotos]).map(async (image, index) => {
        const imageID = reversedImages[index]?.internalID

        if (!imageID) return

        await storeLocalImage(imageID, {
          path: image.path!,
          width: image.width!,
          height: image.height!,
        })
      })
    )

    // Delete images
    const deletedImages = deletedPhotos(dirtyFormCheckValues.photos, photos)
    for (const photo of deletedImages) {
      await deleteArtworkImage(props.artwork.internalID, photo.id)
    }
  }
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
  saveCollectedArtwork: (
    artistId: string,
    isP1Artist: boolean | null | undefined
  ): SaveCollectedArtwork => ({
    action: ActionType.saveCollectedArtwork,
    context_module: ContextModule.myCollectionHome,
    context_owner_type: OwnerType.myCollection,
    artist_id: artistId,
    is_p1_artist: isP1Artist ?? false,
    platform: "mobile",
  }),
}

const addArtworkMessages = async ({
  hasMarketPriceInsights,
  sourceTab,
}: {
  hasMarketPriceInsights: boolean | null | undefined
  sourceTab: Tab
}) => {
  setVisualClueAsSeen("AddedArtworkWithInsightsMessage_InsightsTab")
  setVisualClueAsSeen("AddedArtworkWithInsightsMessage_MyCTab")
  setVisualClueAsSeen("AddedArtworkWithoutInsightsMessage_InsightsTab")
  setVisualClueAsSeen("AddedArtworkWithoutInsightsMessage_MyCTab")

  if (hasMarketPriceInsights) {
    if (sourceTab === Tab.collection) {
      addClue("AddedArtworkWithInsightsMessage_MyCTab")
      addClue("AddedArtworkWithInsightsVisualClueDot")
    } else {
      setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")
      addClue("AddedArtworkWithInsightsMessage_InsightsTab")
    }
  } else {
    if (sourceTab === Tab.collection) {
      addClue("AddedArtworkWithoutInsightsMessage_MyCTab")
    } else {
      setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")
      addClue("AddedArtworkWithoutInsightsMessage_InsightsTab")
    }
  }
}
