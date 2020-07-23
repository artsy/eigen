import { StoreProvider } from "easy-peasy"
import { FormikProvider, useFormik } from "formik"
import React, { useEffect, useRef } from "react"
import { View } from "react-native"
import { Modal } from "./Components/Modal"
import { artworkSchema, validateArtworkSchema } from "./Screens/MyCollectionAddArtwork/Form/artworkSchema"
import { ArtworkFormValues } from "./State/artworkModel"
import { useStoreActions, useStoreState } from "./State/hooks"
import { store } from "./State/store"

interface BootProps {
  children: React.ReactNode
}

export const Boot: React.FC<BootProps> = ({ children }) => {
  return <StoreProvider store={store}>{children}</StoreProvider>
}

export const setupMyCollectionScreen = (Component: React.ComponentType<any>) => {
  const Screen: React.FC = props => {
    const navViewRef = useRef<View>(null)
    const navigationActions = useStoreActions(actions => actions.navigation)
    const artworkActions = useStoreActions(actions => actions.artwork)
    const initialFormValues = useStoreState(state => state.artwork.formValues)

    // FIXME: Don't initialize form for every collection screen; move this to another component
    const initialForm = useFormik<ArtworkFormValues>({
      enableReinitialize: true,
      initialValues: initialFormValues,
      initialErrors: validateArtworkSchema(initialFormValues),
      onSubmit: artworkActions.addArtwork,
      validationSchema: artworkSchema,
    })

    /**
     * Whenever a new view controller is mounted we refresh our navigation
     */
    useEffect(() => {
      navigationActions.setupNavigation({
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

  return (props: any) => {
    return (
      <Boot>
        <Screen {...props} />
      </Boot>
    )
  }
}
