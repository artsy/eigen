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
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import { updateArtwork } from "app/Scenes/MyCollection/Screens/ArtworkForm/methods/uploadArtwork"
import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { myCollectionDeleteArtwork } from "app/Scenes/MyCollection/mutations/myCollectionDeleteArtwork"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { refreshMyCollection, refreshMyCollectionInsights } from "app/utils/refreshHelpers"
import { FormikProvider, useFormik } from "formik"
import { isEqual } from "lodash"
import { useEffect, useRef, useState } from "react"
import { Alert, InteractionManager } from "react-native"
import { useTracking } from "react-tracking"
import { SavingArtworkModal } from "./Components/SavingArtworkModal"
import { artworkSchema, validateArtworkSchema } from "./Form/artworkSchema"
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
  AddMyCollectionArtist: {
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
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")
  const { trackEvent } = useTracking()
  const { formValues, dirtyFormCheckValues } = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState
  )

  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const { mode, onSuccess, onDelete, artwork } = MyCollectionArtworkStore.useStoreState(
    (state) => state
  )

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
      if (mode === "add") {
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
      onSuccess?.()
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

  const handleDelete = async () => {
    if (mode === "edit" && onDelete && artwork) {
      setLoading(true)
      trackEvent(tracks.deleteCollectedArtwork(artwork.internalID, artwork.slug))
      try {
        await myCollectionDeleteArtwork(artwork.internalID)
        refreshMyCollection()
        onDelete()
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
  }

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

    if (mode === "edit") {
      // Reset the form with the initial values from the artwork
      GlobalStore.actions.myCollection.artwork.updateFormValues(dirtyFormCheckValues)
    } else {
      GlobalStore.actions.myCollection.artwork.resetFormButKeepArtist()
    }
  }

  const onHeaderBackButtonPress = () => {
    const currentRoute = navContainerRef.current?.getCurrentRoute()
    const isFirstScreen =
      mode === "edit" || !currentRoute?.name || currentRoute?.name === "ArtworkFormArtist"

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
          {mode === "add" && (
            <Stack.Screen
              name="ArtworkFormArtist"
              component={MyCollectionArtworkFormArtist}
              initialParams={{ onDelete: handleDelete, clearForm, onHeaderBackButtonPress }}
            />
          )}
          {mode === "add" && (
            <Stack.Screen
              name="ArtworkFormArtwork"
              component={MyCollectionArtworkFormArtwork}
              initialParams={{
                onDelete,
                clearForm,
                mode: mode,
                onHeaderBackButtonPress,
              }}
            />
          )}
          {!!enableCollectedArtists && mode === "add" && (
            <Stack.Screen
              name="AddMyCollectionArtist"
              component={AddMyCollectionArtist} // TODO: Rename this component
              initialParams={{
                mode: mode,
                clearForm,
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
              mode: mode,
              onHeaderBackButtonPress,
              isSubmission: (() => {
                if (mode === "edit" && artwork) {
                  return !!artwork.consignmentSubmission?.displayText
                }
                return false
              })(),
            }}
          />
          <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
        </Stack.Navigator>
        {mode === "add" ? (
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

export const MyCollectionArtworkFormScreen: React.FC<MyCollectionArtworkFormProps> = (props) => {
  return (
    <MyCollectionArtworkStore.Provider runtimeModel={props}>
      <MyCollectionArtworkForm {...props} />
    </MyCollectionArtworkStore.Provider>
  )
}

const Stack = createStackNavigator<ArtworkFormScreen>()

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
