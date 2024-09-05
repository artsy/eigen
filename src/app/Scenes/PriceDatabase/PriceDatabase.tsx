import { OwnerType } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { MediumOptions } from "app/Scenes/PriceDatabase/components/MediumOptions"
import { PriceDatabaseSearch } from "app/Scenes/PriceDatabase/components/PriceDatabaseSearch"
import { SizesOptions } from "app/Scenes/PriceDatabase/components/SizesOptions"
import {
  PriceDatabaseSearchModel,
  PriceDatabaseSearchInitialValues,
  priceDatabaseValidationSchema,
} from "app/Scenes/PriceDatabase/validation"
import { routingInstrumentation } from "app/system/errorReporting/sentrySetup"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FormikProvider, useFormik } from "formik"
import { useRef } from "react"

export type PriceDatabaseNavigationStack = {
  PriceDatabaseSearch: undefined
  MediumOptionsScreen: undefined
  SizesOptionsScreen: undefined
}

const Stack = createStackNavigator<PriceDatabaseNavigationStack>()

export const PriceDatabase = () => {
  const handleSubmit = () => {}

  const formik = useFormik<PriceDatabaseSearchModel>({
    initialValues: PriceDatabaseSearchInitialValues,
    initialErrors: {},
    onSubmit: handleSubmit,
    validationSchema: () => priceDatabaseValidationSchema,
    validateOnMount: true,
  })

  const navContainerRef = useRef(null)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.priceDatabase,
      })}
    >
      <FormikProvider value={formik}>
        <NavigationContainer
          independent
          onReady={() => {
            routingInstrumentation.registerNavigationContainer(navContainerRef)
          }}
          ref={navContainerRef}
        >
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
              headerShown: false,
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen name="PriceDatabaseSearch" component={PriceDatabaseSearch} />
            <Stack.Screen name="MediumOptionsScreen" component={MediumOptions} />
            <Stack.Screen name="SizesOptionsScreen" component={SizesOptions} />
          </Stack.Navigator>
        </NavigationContainer>
      </FormikProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
