import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { captureException } from "@sentry/react-native"
import { MyCollectionArtwork_sharedProps } from "__generated__/MyCollectionArtwork_sharedProps.graphql"
import { FormikProvider, useFormik } from "formik"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "lib/Scenes/Consignments/Submission/geminiUploadToS3"
import { cleanArtworkPayload } from "lib/Scenes/MyCollection/utils/cleanArtworkPayload"
import { AppStore } from "lib/store/AppStore"
import { Box, Flex } from "palette"
import React, { useState } from "react"
import { ActivityIndicator, Alert } from "react-native"
import { artworkSchema, validateArtworkSchema } from "../../../MyCollection/Screens/AddArtwork/Form/artworkSchema"
import { ArtworkFormValues } from "../../../MyCollection/State/MyCollectionArtworkModel"
import { myCollectionAddArtwork } from "../../mutations/myCollectionAddArtwork"
import { myCollectionDeleteArtwork } from "../../mutations/myCollectionDeleteArtwork"
import { myCollectionEditArtwork } from "../../mutations/myCollectionEditArtwork"

import { MyCollectionAdditionalDetailsForm } from "./Screens/MyCollectionArtworkFormAdditionalDetails"
import { MyCollectionAddPhotos } from "./Screens/MyCollectionArtworkFormAddPhotos"
import { MyCollectionArtworkForm } from "./Screens/MyCollectionArtworkFormMain"

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
    onDismiss(): void
    onDelete?(): void
  }
  AdditionalDetails: undefined
  AddPhotos: undefined
}

type MyCollectionArtworkFormModalProps = { visible: boolean; onDismiss: () => void; onSuccess: () => void } & (
  | {
      mode: "add"
    }
  | {
      mode: "edit"
      onDelete: () => void
      artwork: Omit<MyCollectionArtwork_sharedProps, " $refType">
    }
)

export const MyCollectionArtworkFormModal: React.FC<MyCollectionArtworkFormModalProps> = (props) => {
  const initialFormValues = AppStore.useAppState((state) => state.myCollection.artwork.sessionState.formValues)
  const [loading, setLoading] = useState<boolean>(false)

  const initialForm = useFormik<ArtworkFormValues>({
    enableReinitialize: true,
    initialValues: initialFormValues,
    initialErrors: validateArtworkSchema(initialFormValues),
    onSubmit: async ({ photos, artistSearchResult, costMinor, artist, artistIds, ...others }) => {
      setLoading(true)
      try {
        const externalImageUrls = await uploadPhotos(photos)
        if (props.mode === "add") {
          await myCollectionAddArtwork({
            artistIds: [artistSearchResult!.internalID as string],
            externalImageUrls,
            costMinor: Number(costMinor),
            ...cleanArtworkPayload(others),
          })
        } else {
          await myCollectionEditArtwork({
            artistIds: [artistSearchResult!.internalID as string],
            artworkId: props.artwork.internalID,
            externalImageUrls,
            costMinor: Number(costMinor),
            ...cleanArtworkPayload(others),
          })
        }
        props.onSuccess()
        setTimeout(() => {
          AppStore.actions.myCollection.artwork.resetForm()
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
          try {
            const result = await myCollectionDeleteArtwork(props.artwork.internalID)
            if (result.myCollectionDeleteArtwork?.artworkOrError?.mutationError) {
              throw new Error(
                `Mutation failed: ${result.myCollectionDeleteArtwork?.artworkOrError?.mutationError.message}`
              )
            }
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

  return (
    <NavigationContainer>
      <FormikProvider value={initialForm}>
        <FancyModal visible={props.visible} onBackgroundPressed={() => props.onDismiss()}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen
              name="ArtworkForm"
              component={MyCollectionArtworkForm}
              initialParams={{ onDelete, onDismiss: props.onDismiss, mode: props.mode }}
            />
            <Stack.Screen name="AdditionalDetails" component={MyCollectionAdditionalDetailsForm} />
            <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
          </Stack.Navigator>
          {!!loading && <LoadingIndicator />}
        </FancyModal>
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormModalScreen>()

const LoadingIndicator = () => {
  return (
    <Box
      style={{
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

async function uploadPhotos(photos: ArtworkFormValues["photos"]) {
  const imagePaths = photos.map((photo) => photo.path)
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"
  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })
  const bucket = assetCredentials.policyDocument.conditions.bucket

  const uploadPromises = imagePaths.map(
    async (path): Promise<string> => {
      const s3 = await uploadFileToS3(path, acl, assetCredentials)
      const url = `https://${bucket}.s3.amazonaws.com/${s3.key}`
      return url
    }
  )

  const externalImageUrls: string[] = await Promise.all(uploadPromises)
  return externalImageUrls
}
