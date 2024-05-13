import { Flex, useSpace } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { validateArtworkSchema } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/artworkSchema"
import { SubmitArtworkAddDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDetails"
import { SubmitArtworkAddDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddDimensions"
import { SubmitArtworkAddPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddPhotos"
import { SubmitArtworkAddProvenance } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddProvenance"
import { SubmitArtworkAddTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAddTitle"
import { SubmitArtworkBottomNavigation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkBottomNavigation"
import { SubmitArtworkCompleteYourSubmission } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkCompleteYourSubmission"
import {
  SubmitArtworkFormStore,
  SubmitArtworkFormStoreProvider,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFormStore"
import { SubmitArtworkNavigationControls } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkNavigationControls"
import { SubmitArtworkSelectArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtist"
import { SubmitArtworkSelectArtworkMyCollectionArtwork } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtworkMyCollectionArtwork"
import { SubmitArtworkStartFlow } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkStartFlow"
import {
  ArtworkDetailsFormModel,
  artworkDetailsEmptyInitialValues,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { useIsKeyboardVisible } from "app/utils/hooks/useIsKeyboardVisible"
import { FormikProvider, useFormik } from "formik"
import { useEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type SubmitArtworkStackNavigation = {
  StartFlow: undefined
  SubmitArtworkSelectArtworkMyCollectionArtwork: undefined
  SelectArtist: undefined
  AddTitle: undefined
  AddPhotos: undefined
  AddDetails: undefined
  AddDimensions: undefined
  AddProvenance: undefined
  CompleteYourSubmission: undefined
}

export const SubmitArtworkForm: React.FC = ({}) => {
  return (
    <SubmitArtworkFormStoreProvider>
      <SubmitArtworkFormContent />
    </SubmitArtworkFormStoreProvider>
  )
}

const SubmitArtworkFormContent: React.FC = ({}) => {
  const currentStep = SubmitArtworkFormStore.useStoreState((state) => state.currentStep)
  const space = useSpace()
  const { bottom: bottomInset } = useSafeAreaInsets()
  const isKeyboardVisible = useIsKeyboardVisible(true)

  const initialValues = artworkDetailsEmptyInitialValues as any

  const handleSubmit = (values: ArtworkDetailsFormModel) => {
    createOrUpdateSubmission(values, "")
  }

  const formik = useFormik<ArtworkDetailsFormModel>({
    enableReinitialize: true,
    initialValues: initialValues,
    initialErrors: validateArtworkSchema(initialValues),
    onSubmit: handleSubmit,
    validationSchema: getCurrentValidationSchema,
  })

  // Revalidate form on step change because the validation schema changes and it does not happen automatically
  useEffect(() => {
    formik.validateForm()
  }, [currentStep])

  return (
    <FormikProvider value={formik}>
      <SubmitArtworkNavigationControls />
      <ArtsyKeyboardAvoidingView>
        <Flex
          flex={1}
          style={{
            paddingBottom: isKeyboardVisible ? 0 : bottomInset,
            paddingHorizontal: space(2),
          }}
        >
          <NavigationContainer independent ref={__unsafe__SubmissionArtworkFormNavigationRef}>
            <Stack.Navigator
              // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
              detachInactiveScreens={false}
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "white" },
                keyboardHandlingEnabled: false,
              }}
            >
              <Stack.Screen name="StartFlow" component={SubmitArtworkStartFlow} />

              <Stack.Screen
                name="SubmitArtworkSelectArtworkMyCollectionArtwork"
                component={SubmitArtworkSelectArtworkMyCollectionArtwork}
              />

              <Stack.Screen name="SelectArtist" component={SubmitArtworkSelectArtist} />

              <Stack.Screen name="AddTitle" component={SubmitArtworkAddTitle} />

              <Stack.Screen name="AddPhotos" component={SubmitArtworkAddPhotos} />

              <Stack.Screen name="AddDetails" component={SubmitArtworkAddDetails} />

              <Stack.Screen name="AddDimensions" component={SubmitArtworkAddDimensions} />

              <Stack.Screen name="AddProvenance" component={SubmitArtworkAddProvenance} />

              <Stack.Screen
                name="CompleteYourSubmission"
                component={SubmitArtworkCompleteYourSubmission}
              />
            </Stack.Navigator>
            <SubmitArtworkBottomNavigation />
          </NavigationContainer>
        </Flex>
      </ArtsyKeyboardAvoidingView>
    </FormikProvider>
  )
}

const Stack = createStackNavigator<SubmitArtworkStackNavigation>()

export const __unsafe__SubmissionArtworkFormNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export const getCurrentRoute = () =>
  __unsafe__SubmissionArtworkFormNavigationRef.current?.getCurrentRoute()?.name as
    | keyof SubmitArtworkStackNavigation
    | undefined
