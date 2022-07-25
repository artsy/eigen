import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { GlobalStore } from "app/store/GlobalStore"
import { OnboardingProvider } from "./Hooks/useOnboardingContext"
import { OnboardingPersonalizationStart } from "./OnboardingPersonalizationStart"
import { OnboardingPersonalizationWelcome } from "./OnboardingPersonalizationWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingPersonalization2NavigationStack = {
  OnboardingPersonalizationWelcome: undefined
  // This is where we want to add the next screen
  OnboardingPersonalizationStart: undefined
  OnboardingPersonalizationArtworksAnimation: undefined
}

const StackNavigator = createStackNavigator<OnboardingPersonalization2NavigationStack>()

export const OnboardingPersonalization2 = () => {
  // this function marks onBoardingState as complete when the flow is done will be changed
  // when onboarding is fully out to just navigate to home screen
  const handleDone = () => GlobalStore.actions.auth.setState({ onboardingState: "complete" })

  return (
    <OnboardingProvider onDone={handleDone}>
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
            name="OnboardingPersonalizationArtworksAnimation"
            component={OnboardingPersonalizationWelcome}
          />
          <StackNavigator.Screen
            name="OnboardingPersonalizationStart"
            component={OnboardingPersonalizationStart}
          />
        </StackNavigator.Navigator>
      </NavigationContainer>
    </OnboardingProvider>
  )
}
