import { Flex, Screen, Text, Touchable } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { validateArtworkSchema } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/artworkSchema"
import { ArtworkFormCompleteYourSubmission } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormCompleteYourSubmission"
import { SubmissionArtworkFormArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormArtist"
import { SubmissionArtworkFormArtworkDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormArtworkDetails"
import { SubmissionArtworkFormPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormPhotos"
import { SubmissionArtworkFormTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmissionArtworkFormTitle"
import {
  navigateToNextStep,
  navigateToPreviousStep,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import {
  ArtworkDetailsFormModel,
  artworkDetailsEmptyInitialValues,
  artworkDetailsValidationSchema,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormik, FormikProvider } from "formik"

export type ArtworkFormScreen = {
  ArtworkFormArtist: undefined
  ArtworkFormTitle: undefined
  ArtworkFormPhotos: undefined
  ArtworkFormArtworkDetails: undefined
  AddPhotos: undefined
  ArtworkFormCompleteYourSubmission: undefined
}

export const STEPS = [
  "ArtworkFormArtist",
  "ArtworkFormTitle",
  "ArtworkFormPhotos",
  "ArtworkFormArtworkDetails",
  "ArtworkFormCompleteYourSubmission",
]

interface SubmissionArtworkFormProps {}

export const SubmissionArtworkForm: React.FC<SubmissionArtworkFormProps> = ({}) => {
  const initialValues = artworkDetailsEmptyInitialValues as any

  const handleSubmit = (values: ArtworkDetailsFormModel) => {
    createOrUpdateSubmission(values, "")

    if (formik.values.submissionId) {
      // updateSubmissionMutation()
    }
    // const submissionID = createSubmissionMutation()

    // formik.setFieldValue("submissionId", submissionID)
    // TODO: Submit or update submission
    // TODO: Later: Submit or update My Collection artwork?
  }

  const formik = useFormik<ArtworkDetailsFormModel>({
    enableReinitialize: true,
    initialValues: initialValues,
    initialErrors: validateArtworkSchema(initialValues),
    onSubmit: handleSubmit,
    validationSchema: artworkDetailsValidationSchema,
  })

  // Wrapper component which includes
  // - Navigation elements: progress bar, back/next controls
  // - Submission preview: built up as a collector goes through the flow
  // - The active step and its contents

  const handleBackPress = () => {
    navigateToPreviousStep()
  }
  const handleSavePress = () => {
    navigateToNextStep()
  }

  return (
    <Screen>
      <Screen.Header
        onBack={handleBackPress}
        rightElements={
          <Touchable onPress={handleSavePress}>
            <Text>Next</Text>
          </Touchable>
        }
      />

      <Screen.Body>
        <Flex flex={1}>
          <NavigationContainer independent ref={__unsafe__SubmissionArtworkFormNavigationRef}>
            <FormikProvider value={formik}>
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
                  name="ArtworkFormCompleteYourSubmission"
                  component={ArtworkFormCompleteYourSubmission}
                />
              </Stack.Navigator>
            </FormikProvider>
          </NavigationContainer>
        </Flex>
      </Screen.Body>
    </Screen>
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
