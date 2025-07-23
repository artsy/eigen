import { ActionType, ContextModule, OwnerType, SaveCollectedArtwork } from "@artsy/cohesion"
import { Flex, Screen, useColor } from "@artsy/palette-mobile"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationIndependentTree,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { MyCollectionArtworkEditQuery } from "__generated__/MyCollectionArtworkEditQuery.graphql"
import { LengthUnitPreference } from "__generated__/UserPrefsModelQuery.graphql"
import { FadeIn } from "app/Components/FadeIn"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import {
  AddMyCollectionArtist,
  MyCollectionCustomArtistSchema,
} from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { MyCollectionArtworkStore } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkStore"
import { saveOrUpdateArtwork } from "app/Scenes/MyCollection/Screens/ArtworkForm/methods/uploadArtwork"
import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { GlobalStore } from "app/store/GlobalStore"
import { dismissModal } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { refreshMyCollection, refreshMyCollectionInsights } from "app/utils/refreshHelpers"
import { FormikProvider, useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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
  ArtworkFormArtist: undefined
  ArtworkFormArtwork: undefined
  // Params can be deleted as soon as we consolidate add artwork and add artist flows
  AddMyCollectionArtist: {
    artistDisplayName: string
    onSubmit: (artistId: MyCollectionCustomArtistSchema) => void
  }
  ArtworkFormMain: undefined
  AddPhotos: undefined
}

export type MyCollectionArtworkFormProps =
  | {
      mode: "add"
      source: Tab
    }
  | {
      mode: "edit"
      artwork: MyCollectionArtworkEditQuery["response"]["artwork"]
    }

const navContainerRef = { current: null as NavigationContainerRef<any> | null }

export const MyCollectionArtworkForm: React.FC<MyCollectionArtworkFormProps> = (props) => {
  const color = useColor()
  const theme = useNavigationTheme()
  const enableShowError = useDevToggle("DTShowErrorInLoadFailureView")
  const { trackEvent } = useTracking()
  const { formValues, dirtyFormCheckValues } = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState
  )

  const preferredCurrency = GlobalStore.useAppState((state) => state.userPrefs.currency)
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const { mode } = MyCollectionArtworkStore.useStoreState((state) => state)

  // we need to store the form values in a ref so that onDismiss can access their current value (prop updates are not
  // sent through the react-navigation system)
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const [loading, setLoading] = useState<boolean>(false)
  const [isArtworkSaved, setIsArtworkSaved] = useState<boolean>(false)
  const [savingArtworkModalDisplayText, setSavingArtworkModalDisplayText] = useState<string>("")

  const handleSubmit = async (values: ArtworkFormValues) => {
    if (loading) {
      return
    }

    setLoading(true)

    try {
      updateMyUserProfile({
        currencyPreference: preferredCurrency,
        lengthUnitPreference: preferredMetric.toUpperCase() as LengthUnitPreference,
      })

      await Promise.all([
        // This is to satisfy showing the insights modal for 2500 ms
        __TEST__ ? undefined : new Promise((resolve) => setTimeout(resolve, 2500)),
        saveOrUpdateArtwork(values, dirtyFormCheckValues, props).then((hasMarketPriceInsights) => {
          setSavingArtworkModalDisplayText(
            hasMarketPriceInsights ? "Generating market data" : "Saving artwork"
          )
        }),
      ])

      const artistId = values.artistIds?.[0] || values.artistSearchResult?.internalID

      // Adding tracking after a successfully adding an artwork
      if (mode === "add" && artistId) {
        trackEvent(
          tracks.saveCollectedArtwork(artistId, values.artistSearchResult?.targetSupply?.isP1)
        )
      }

      setIsArtworkSaved(true)
      // simulate requesting market data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      refreshMyCollection()
      refreshMyCollectionInsights({})

      dismissModal()
    } catch (error: any) {
      console.error("Artwork could not be saved", error)
      setLoading(false)
      Alert.alert("Artwork could not be saved", enableShowError ? error?.message : undefined)
    }
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

  const safeAreaInsets = useSafeAreaInsets()

  return (
    <NavigationIndependentTree>
      <NavigationContainer ref={navContainerRef} theme={theme}>
        <FormikProvider value={formik}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: {
                backgroundColor: color("background"),
                paddingTop: safeAreaInsets.top,
                paddingBottom: safeAreaInsets.bottom,
              },
            }}
          >
            {mode === "add" && (
              <Stack.Screen name="ArtworkFormArtist" component={MyCollectionArtworkFormArtist} />
            )}
            {mode === "add" && (
              <Stack.Screen name="ArtworkFormArtwork" component={MyCollectionArtworkFormArtwork} />
            )}
            {mode === "add" && (
              <Stack.Screen
                name="AddMyCollectionArtist"
                component={AddMyCollectionArtist} // TODO: Rename this component
              />
            )}
            <Stack.Screen name="ArtworkFormMain" component={MyCollectionArtworkFormMain} />
            <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
          </Stack.Navigator>

          {mode === "add" && loading ? (
            <FadeIn slide>
              <Flex height="100%" width="100%" testID="saving-artwork-modal">
                <SavingArtworkModal
                  isVisible={loading}
                  loadingText={isArtworkSaved ? savingArtworkModalDisplayText : "Saving artwork"}
                />
              </Flex>
            </FadeIn>
          ) : null}

          {mode === "edit" && loading ? (
            <FadeIn slide style={{ position: "absolute", height: "100%", width: "100%" }}>
              <Flex flex={1} testID="saving-artwork-modal">
                <LoadingSpinner />
              </Flex>
            </FadeIn>
          ) : null}
        </FormikProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}

export const MyCollectionArtworkAdd: React.FC<{
  source: Tab
}> = ({ source }) => {
  return <MyCollectionArtworkFormScreen mode="add" source={source} />
}

export const MyCollectionArtworkFormScreen: React.FC<MyCollectionArtworkFormProps> = (props) => {
  return (
    <Screen safeArea={false}>
      <MyCollectionArtworkStore.Provider runtimeModel={props}>
        <MyCollectionArtworkForm {...props} />
      </MyCollectionArtworkStore.Provider>
    </Screen>
  )
}

const Stack = createStackNavigator<ArtworkFormScreen>()

const tracks = {
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
