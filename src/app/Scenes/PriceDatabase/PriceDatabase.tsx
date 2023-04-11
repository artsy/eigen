import { NavigationContainer } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { MediumOptions } from "app/Scenes/PriceDatabase/MediumOptions"
import { PriceDatabaseForm } from "app/Scenes/PriceDatabase/PriceDatabaseForm"
import {
  PriceDatabaseFormModel,
  priceDatabaseValidationSchema,
} from "app/Scenes/PriceDatabase/validation"
import { FormikProvider, useFormik } from "formik"

export type PriceDatabaseNavigationStack = {
  PriceDatabaseForm: undefined
  MediumOptionsScreen: undefined
}

const Stack = createStackNavigator<PriceDatabaseNavigationStack>()

export const PriceDatabase = () => {
  const handleSubmit = () => {}

  const formik = useFormik<PriceDatabaseFormModel>({
    initialValues: {
      artist: "",
      artistId: "",
      categories: [],
    },
    initialErrors: {},
    onSubmit: handleSubmit,
    validationSchema: () => priceDatabaseValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <NavigationContainer independent>
        <Stack.Navigator
          // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
          detachInactiveScreens={false}
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            cardStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen name="PriceDatabaseForm" component={PriceDatabaseForm} />
          <Stack.Screen
            name="MediumOptionsScreen"
            component={MediumOptions}
            // initialParams={props}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FormikProvider>
  )
}
