import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { Text } from "palette"
import { OnboardingPersonalizationWelcome } from "./OnboardingPersonalizationWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingPersonalization2NavigationStack = {
  OnboardingPersonalizationWelcome: undefined
  // This is where we want to add the next screen
  NextScreen: undefined
}

const StackNavigator = createStackNavigator<OnboardingPersonalization2NavigationStack>()

export const OnboardingPersonalization2 = () => (
  <NavigationContainer independent>
    <StackNavigator.Navigator
      headerMode="screen"
      screenOptions={{
        ...TransitionPresets.ModalTransition,
        headerShown: false,
      }}
    >
      <StackNavigator.Screen
        name="OnboardingPersonalizationWelcome"
        component={OnboardingPersonalizationWelcome}
      />
      <StackNavigator.Screen
        // This is where we want to add the next screen
        name="NextScreen"
        component={() => <Text>Next Screen</Text>}
      />
    </StackNavigator.Navigator>
  </NavigationContainer>
)
