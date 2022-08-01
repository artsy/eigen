import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { GlobalStore } from "app/store/GlobalStore"
import { OnboardingProvider } from "./Hooks/useOnboardingContext"
import { OnboardingFollowArtists } from "./OnboardingFollowArtists"
import { OnboardingFollowGalleries } from "./OnboardingFollowGalleries"
import { OnboardingPersonalizationWelcome } from "./OnboardingPersonalizationWelcome"
import { OnboardingQuestionOne, OnboardingQuestionThree, OnboardingQuestionTwo } from "./Questions"
import { OnboardingPostFollowLoadingScreen } from "./OnboardingPostFollowLoadingScreen"


// tslint:disable-next-line:interface-over-type-literal
export type OnboardingPersonalization2NavigationStack = {
  OnboardingPersonalizationWelcome: undefined
  OnboardingQuestionOne: undefined
  OnboardingQuestionTwo: undefined
  OnboardingQuestionThree: undefined
  OnboardingFollowArtists: undefined
  OnboardingFollowGalleries: undefined
  OnboardingPostFollowLoadingScreen: undefined
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
            ...TransitionPresets.DefaultTransition,
            headerShown: false,
          }}
        >
          <StackNavigator.Screen
            name="OnboardingPersonalizationWelcome"
            component={OnboardingPersonalizationWelcome}
          />
          <StackNavigator.Screen name="OnboardingQuestionOne" component={OnboardingQuestionOne} />
          <StackNavigator.Screen name="OnboardingQuestionTwo" component={OnboardingQuestionTwo} />
          <StackNavigator.Screen
            name="OnboardingQuestionThree"
            component={OnboardingQuestionThree}
          />
          <StackNavigator.Screen
            name="OnboardingFollowArtists"
            component={OnboardingFollowArtists}
          />
          <StackNavigator.Screen
            name="OnboardingFollowGalleries"
            component={OnboardingFollowGalleries}
          />
          <StackNavigator.Screen
            name="OnboardingPostFollowLoadingScreen"
            component={OnboardingPostFollowLoadingScreen}
          />
        </StackNavigator.Navigator>
      </NavigationContainer>
    </OnboardingProvider>
  )
}
