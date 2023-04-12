import { OwnerType } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { MediumOptions } from "app/Scenes/PriceDatabase/MediumOptions"
import { PriceDatabaseForm } from "app/Scenes/PriceDatabase/PriceDatabaseForm"
import { SizesOptions } from "app/Scenes/PriceDatabase/SizesOptions"
import {
  PriceDatabaseFormModel,
  priceDatabaseFormInitialValues,
  priceDatabaseValidationSchema,
} from "app/Scenes/PriceDatabase/validation"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FormikProvider, useFormik } from "formik"

export type PriceDatabaseNavigationStack = {
  PriceDatabaseForm: undefined
  MediumOptionsScreen: undefined
  SizesOptionsScreen: undefined
}

const Stack = createStackNavigator<PriceDatabaseNavigationStack>()

export const PriceDatabase = () => {
  const handleSubmit = () => {}

  const formik = useFormik<PriceDatabaseFormModel>({
    initialValues: priceDatabaseFormInitialValues,
    initialErrors: {},
    onSubmit: handleSubmit,
    validationSchema: () => priceDatabaseValidationSchema,
  })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.priceDatabase,
      })}
    >
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
            <Stack.Screen name="MediumOptionsScreen" component={MediumOptions} />
            <Stack.Screen name="SizesOptionsScreen" component={SizesOptions} />
          </Stack.Navigator>
        </NavigationContainer>
      </FormikProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
