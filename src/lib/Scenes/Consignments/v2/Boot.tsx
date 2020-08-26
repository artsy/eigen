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
    const initialFormValues = AppStore.useAppState(state => state.myCollection.artwork.sessionState.formValues)

    // FIXME: Don't initialize form for every collection screen; move this to another component
    const initialForm = useFormik<ArtworkFormValues>({
      enableReinitialize: true,
      initialValues: initialFormValues,
      initialErrors: validateArtworkSchema(initialFormValues),
      onSubmit: AppStore.actions.myCollection.artwork.addArtwork,
      validationSchema: artworkSchema,
    })

    /**
     * Whenever a new view controller is mounted we refresh our navigation
     */
    useEffect(() => {
      AppStore.actions.myCollection.navigation.setupNavigation({
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
