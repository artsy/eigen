import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { validateArtworkSchema } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/artworkSchema"
import { SubmissionArtworkFormArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkFormArtist"
import { SubmissionArtworkFormArtworkDetails } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkFormArtworkDetails"
import { SubmissionArtworkFormPhotos } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkFormPhotos"
import { SubmissionArtworkFormTitle } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkFormTitle"
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
}

interface SubmissionArtworkFormProps {}

export const SubmissionArtworkForm: React.FC<SubmissionArtworkFormProps> = ({}) => {
  const handleSubmit = () => {}

  const initialValues = artworkDetailsEmptyInitialValues as any

  const formik = useFormik<ArtworkDetailsFormModel>({
    enableReinitialize: true,
    initialValues: initialValues,
    initialErrors: validateArtworkSchema(initialValues),
    onSubmit: handleSubmit,
    validationSchema: artworkDetailsValidationSchema,
  })

  return (
    <NavigationContainer independent>
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
        </Stack.Navigator>
      </FormikProvider>
    </NavigationContainer>
  )
}

const Stack = createStackNavigator<ArtworkFormScreen>()
