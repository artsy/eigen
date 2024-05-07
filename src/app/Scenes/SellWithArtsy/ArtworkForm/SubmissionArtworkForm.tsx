import { Flex, Screen } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { validateArtworkSchema } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/artworkSchema"
import { ArtworkFormCompleteYourSubmission } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormCompleteYourSubmission"
import {
  ArtworkFormStore,
  ArtworkFormStoreProvider,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import { SubmissionArtworkFormArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormArtist"
import { SubmissionArtworkFormArtworkDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormArtworkDetails"
import { SubmissionArtworkDimensions } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormDimensions"
import { SubmissionArtworkFormPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormPhotos"
import { SubmissionArtworkFormProgressBar } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormProgressBar"
import { SubmissionArtworkFormProvenance } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormProvenance"
import { SubmissionArtworkFormTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormTitle"
import { useSubmissionContext } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import {
  ArtworkDetailsFormModel,
  artworkDetailsEmptyInitialValues,
  getCurrentValidationSchema,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { useReloadedDevNavigationState } from "app/system/navigation/useReloadedDevNavigationState"
import { FormikProvider, useFormik } from "formik"
import { useEffect } from "react"

export type ArtworkFormScreen = {
  ArtworkFormArtist: undefined
  ArtworkFormTitle: undefined
  ArtworkFormPhotos: undefined
  ArtworkFormArtworkDetails: undefined
  AddPhotos: undefined
  ArtworkFormDimensions: undefined
  ArtworkFormProvenance: undefined
  ArtworkFormCompleteYourSubmission: undefined
}

export type ArtworkFormStep = keyof ArtworkFormScreen

export const ARTWORK_FORM_STEPS: ArtworkFormStep[] = [
  "ArtworkFormArtist",
  "ArtworkFormTitle",
  "ArtworkFormPhotos",
  "ArtworkFormArtworkDetails",
  "ArtworkFormDimensions",
  "ArtworkFormProvenance",
  "ArtworkFormCompleteYourSubmission",
]

export const SubmissionArtworkForm: React.FC = ({}) => {
  return (
    <ArtworkFormStoreProvider>
      <SubmissionArtworkFormContent />
    </ArtworkFormStoreProvider>
  )
}
const ARTWORK_SUBMISSION_NAVIGATION_STACK_STATE_KEY =
  "ARTWORK_SUBMISSION_NAVIGATION_STACK_STATE_KEY"

const SubmissionArtworkFormContent: React.FC = ({}) => {
  const currentStep = ArtworkFormStore.useStoreState((state) => state.currentStep)
  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    ARTWORK_SUBMISSION_NAVIGATION_STACK_STATE_KEY
  )
  const initialValues = artworkDetailsEmptyInitialValues as any
  const { navigateToPreviousStep } = useSubmissionContext()

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

  const handleBackPress = () => {
    navigateToPreviousStep()
  }

  // Revalidate form on step change because the validation schema changes and it does not happen automatically
  useEffect(() => {
    formik.validateForm()
  }, [currentStep])

  if (!isReady) {
    return null
  }

  return (
    <FormikProvider value={formik}>
      <Screen>
        <Screen.Header onBack={handleBackPress} />

        <Screen.Body>
          <SubmissionArtworkFormProgressBar />

          <Flex flex={1}>
            <NavigationContainer
              independent
              initialState={initialState}
              ref={__unsafe__SubmissionArtworkFormNavigationRef}
              onStateChange={(state) => {
                saveSession(state)
              }}
            >
              <Stack.Navigator
                // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
                detachInactiveScreens={false}
                screenOptions={{
                  headerShown: false,
                  cardStyle: { backgroundColor: "white" },
                }}
              >
                <Stack.Screen name="ArtworkFormArtist" component={SubmissionArtworkFormArtist} />

                <Stack.Screen name="ArtworkFormTitle" component={SubmissionArtworkFormTitle} />

                <Stack.Screen name="ArtworkFormPhotos" component={SubmissionArtworkFormPhotos} />

                <Stack.Screen
                  name="ArtworkFormArtworkDetails"
                  component={SubmissionArtworkFormArtworkDetails}
                />

                <Stack.Screen
                  name="ArtworkFormDimensions"
                  component={SubmissionArtworkDimensions}
                />

                <Stack.Screen
                  name="ArtworkFormProvenance"
                  component={SubmissionArtworkFormProvenance}
                />

                <Stack.Screen
                  name="ArtworkFormCompleteYourSubmission"
                  component={ArtworkFormCompleteYourSubmission}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Flex>
        </Screen.Body>
      </Screen>
    </FormikProvider>
  )
}

const Stack = createStackNavigator<ArtworkFormScreen>()

export const __unsafe__SubmissionArtworkFormNavigationRef: React.MutableRefObject<NavigationContainerRef<any> | null> =
  {
    current: null,
  }

export const getCurrentRoute = () =>
  __unsafe__SubmissionArtworkFormNavigationRef.current?.getCurrentRoute()?.name as
    | keyof ArtworkFormScreen
    | undefined
