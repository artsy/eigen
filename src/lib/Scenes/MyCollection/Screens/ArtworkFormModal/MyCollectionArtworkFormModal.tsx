import { deleteCollectedArtwork } from "@artsy/cohesion"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { captureException } from "@sentry/react-native"
import { MyCollectionArtwork_sharedProps } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { FormikProvider, useFormik } from "formik"
import { cleanArtworkPayload, explicitlyClearedFields } from "lib/Scenes/MyCollection/utils/cleanArtworkPayload"
import { GlobalStore } from "lib/store/GlobalStore"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { useTracking } from "react-tracking"
import { myCollectionAddArtwork } from "../../mutations/myCollectionAddArtwork"
import { myCollectionDeleteArtwork } from "../../mutations/myCollectionDeleteArtwork"
import { myCollectionEditArtwork } from "../../mutations/myCollectionEditArtwork"
import { ArtworkFormValues } from "../../State/MyCollectionArtworkModel"
import { artworkSchema, validateArtworkSchema } from "./Form/artworkSchema"

import { useActionSheet } from "@expo/react-native-action-sheet"
import { LoadingIndicator } from "lib/Components/LoadingIndicator"
import { BackButton } from "lib/navigation/BackButton"
import { goBack } from "lib/navigation/navigate"
import { getConvertedImageUrlFromS3 } from "lib/utils/getConvertedImageUrlFromS3"
import { useUpdadeShouldHideBackButton } from "lib/utils/hideBackButtonOnScroll"
import { isEqual } from "lodash"
import { deleteArtworkImage } from "../../mutations/deleteArtworkImage"
import { refreshMyCollection } from "../../MyCollection"
import { deletedPhotoIDs } from "../../utils/deletedPhotoIDs"
import { MyCollectionAdditionalDetailsForm } from "./Screens/MyCollectionArtworkFormAdditionalDetails"
import { MyCollectionAddPhotos } from "./Screens/MyCollectionArtworkFormAddPhotos"
import { MyCollectionArtworkFormMain } from "./Screens/MyCollectionArtworkFormMain"

export type ArtworkFormMode = "add" | "edit"

// This needs to be a `type` rather than an `interface` because there's
// a long-standing thing where a typescript `interface` will be treated a bit more strictly
// than the equivalent `type` in some situations.
// https://github.com/microsoft/TypeScript/issues/15300
// The react-navigation folks have written code that relies on the more permissive `type` behaviour.
// tslint:disable-next-line:interface-over-type-literal
export type ArtworkFormModalScreen = {
  ArtworkForm: {
    mode: ArtworkFormMode
    clearForm(): void
    onDelete?(): void
    onHeaderBackButtonPress(): void
  }
  AdditionalDetails: {
    onHeaderBackButtonPress(): void
  }
  AddPhotos: {
    onHeaderBackButtonPress(): void
  }
}

type MyCollectionArtworkFormModalProps = { onSuccess: () => void } & (
  | {
      mode: "add"
    }
  | {
      mode: "edit"
      onDelete: () => void
      artwork: Omit<MyCollectionArtwork_sharedProps, " $refType">
    }
)

const navContainerRef = { current: null as NavigationContainerRef | null }

export const MyCollectionArtworkFormModal: React.FC<MyCollectionArtworkFormModalProps> = (props) => {
  const { trackEvent } = useTracking()
  const { formValues, dirtyFormCheckValues } = GlobalStore.useAppState(
    (state) => state.myCollection.artwork.sessionState
  )

  // we need to store the form values in a ref so that onDismiss can access their current value (prop updates are not
  // sent through the react-navigation system)
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const [loading, setLoading] = useState<boolean>(false)

  const { showActionSheetWithOptions } = useActionSheet()

  const formik = useFormik<ArtworkFormValues>({
    enableReinitialize: true,
    initialValues: formValues,
    initialErrors: validateArtworkSchema(formValues),
    onSubmit: async ({
      photos,
      artistSearchResult,
      pricePaidDollars,
      pricePaidCurrency,
      artist,
      artistIds,
      ...others
    }) => {
      setLoading(true)
      try {
        const externalImageUrls = await uploadPhotos(photos)

        let pricePaidCents
        if (pricePaidDollars && !isNaN(Number(pricePaidDollars))) {
          pricePaidCents = Number(pricePaidDollars) * 100
        }

        if (props.mode === "add") {
          await myCollectionAddArtwork({
            artistIds: [artistSearchResult!.internalID as string],
            externalImageUrls,
            pricePaidCents,
            pricePaidCurrency,
            ...cleanArtworkPayload(others),
          })
        } else {
          await myCollectionEditArtwork({
            artistIds: [artistSearchResult!.internalID as string],
            artworkId: props.artwork.internalID,
            externalImageUrls,
            pricePaidCents: pricePaidCents ?? null,
            pricePaidCurrency,
            ...cleanArtworkPayload(others),
            ...explicitlyClearedFields(others, dirtyFormCheckValues),
          })

          const deletedIDs = deletedPhotoIDs(dirtyFormCheckValues.photos, photos)
          for (const deletedID of deletedIDs) {
            await deleteArtworkImage(props.artwork.internalID, deletedID)
          }
        }
        refreshMyCollection()
        props.onSuccess()
        setTimeout(() => {
          GlobalStore.actions.myCollection.artwork.resetForm()
        }, 500)
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
    },
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
            setTimeout(() => {
              // reset form values incase user deleted after editing
              GlobalStore.actions.myCollection.artwork.resetForm()
            }, 500)
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

    GlobalStore.actions.myCollection.artwork.resetForm()
  }

  const onHeaderBackButtonPress = () => {
    const currentRoute = navContainerRef.current?.getCurrentRoute()
    if (!currentRoute?.name || currentRoute?.name === "ArtworkForm") {
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
            safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
            cardStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen
            name="ArtworkForm"
            component={MyCollectionArtworkFormMain}
            initialParams={{ onDelete, clearForm, mode: props.mode, onHeaderBackButtonPress }}
          />
          <Stack.Screen
            name="AdditionalDetails"
            component={MyCollectionAdditionalDetailsForm}
            initialParams={{ onHeaderBackButtonPress }}
          />
          <Stack.Screen
            name="AddPhotos"
            component={MyCollectionAddPhotos}
            initialParams={{ onHeaderBackButtonPress }}
          />
        </Stack.Navigator>
        {!!loading && <LoadingIndicator />}
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormModalScreen>()

export async function uploadPhotos(photos: ArtworkFormValues["photos"]) {
  GlobalStore.actions.myCollection.artwork.setLastUploadedPhoto(photos[0])
  // only recently added photos have a path
  const imagePaths: string[] = photos.map((photo) => photo.path).filter((path): path is string => path !== undefined)
  const externalImageUrls: string[] = []

  for (const path of imagePaths) {
    const url = await getConvertedImageUrlFromS3(path)
    externalImageUrls.push(url)
  }

  return externalImageUrls
}

const tracks = {
  deleteCollectedArtwork: (internalID: string, slug: string) => {
    return deleteCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
