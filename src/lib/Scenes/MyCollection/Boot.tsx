import { FormikProvider, useFormik } from "formik"
import { AppStore } from "lib/store/AppStore"
import React, { useEffect, useRef } from "react"
import { View } from "react-native"
import { Modal } from "./Components/Modal"
import { artworkSchema, validateArtworkSchema } from "./Screens/AddArtwork/Form/artworkSchema"
import { ArtworkFormValues } from "./State/MyCollectionArtworkModel"

export const setupMyCollectionScreen = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const navViewRef = useRef<View>(null)
    const artworkActions = AppStore.actions.myCollection.artwork
    const navActions = AppStore.actions.myCollection.navigation
    const initialFormValues = AppStore.useAppState(state => state.myCollection.artwork.sessionState.formValues)
    const modalType = AppStore.useAppState(state => state.myCollection.navigation.sessionState.modalType)
    const handleSubmit = modalType === "add" ? artworkActions.addArtwork : artworkActions.editArtwork

    // TODO: Don't initialize form for every collection screen; move this to another component
    const initialForm = useFormik<ArtworkFormValues>({
      enableReinitialize: true,
      initialValues: initialFormValues,
      initialErrors: validateArtworkSchema(initialFormValues),
      onSubmit: handleSubmit,
      validationSchema: artworkSchema,
    })

    /**
     * Whenever a new view controller is mounted we refresh our navigation
     */
    useEffect(() => {
      navActions.setupNavigation({
        navViewRef,
      })
    }, [])

    return (
      <View ref={navViewRef}>
        <FormikProvider value={initialForm}>
          <Component {...props} />
          <Modal />
        </FormikProvider>
      </View>
    )
  }
}
