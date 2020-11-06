import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { FormikProvider, useFormik } from "formik"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { AppStore } from "lib/store/AppStore"
import React from "react"
import { ArtworkFormValues } from "../State/MyCollectionArtworkModel"
import { artworkSchema, validateArtworkSchema } from "./AddArtwork/Form/artworkSchema"
import { MyCollectionAdditionalDetailsForm } from "./MyCollectionAdditionalDetailsForm"
import { MyCollectionAddPhotos } from "./MyCollectionAddPhotos"

import { MyCollectionArtworkForm } from "./MyCollectionArtworkForm"

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
  }
  AdditionalDetails: undefined
  AddPhotos: undefined
}

export const MyCollectionArtworkFormModal: React.FC<{
  mode: ArtworkFormMode
  visible: boolean
  onDismiss: () => void
}> = ({ mode, visible, onDismiss }) => {
  const initialFormValues = AppStore.useAppState((state) => state.myCollection.artwork.sessionState.formValues)
  const artworkActions = AppStore.actions.myCollection.artwork
  const handleSubmit = mode === "add" ? artworkActions.addArtwork : artworkActions.editArtwork

  // TODO: Don't initialize form for every collection screen; move this to another component
  const initialForm = useFormik<ArtworkFormValues>({
    enableReinitialize: true,
    initialValues: initialFormValues,
    initialErrors: validateArtworkSchema(initialFormValues),
    onSubmit: handleSubmit,
    validationSchema: artworkSchema,
  })

  return (
    <NavigationContainer>
      <FormikProvider value={initialForm}>
        <FancyModal visible={visible} onBackgroundPressed={() => onDismiss()}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen name="ArtworkForm" component={MyCollectionArtworkForm} initialParams={{ mode, onDismiss }} />
            <Stack.Screen name="AdditionalDetails" component={MyCollectionAdditionalDetailsForm} />
            <Stack.Screen name="AddPhotos" component={MyCollectionAddPhotos} />
          </Stack.Navigator>
        </FancyModal>
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormModalScreen>()
