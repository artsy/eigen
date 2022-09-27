import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { OnboardingProvider } from "./Hooks/useOnboardingContext"
import { useUpdateUserProfile } from "./Hooks/useUpdateUserProfile"
import { OnboardingArtistsOnTheRise } from "./OnboardingArtistsOnTheRise"
import { OnboardingArtistsOnTheRiseCollection } from "./OnboardingArtistsOnTheRiseCollection"
import { OnboardingCuratedArtworks } from "./OnboardingCuratedArtworks"
import { OnboardingCuratedArtworksCollection } from "./OnboardingCuratedArtworksCollection"
import { OnboardingFollowArtists } from "./OnboardingFollowArtists"
import { OnboardingFollowGalleries } from "./OnboardingFollowGalleries"
import { OnboardingPostFollowLoadingScreen } from "./OnboardingPostFollowLoadingScreen"
import { OnboardingQuestionOne } from "./OnboardingQuestionOne"
import { OnboardingQuestionThree } from "./OnboardingQuestionThree"
import { OnboardingQuestionTwo } from "./OnboardingQuestionTwo"
import { OnboardingTopAuctionLots } from "./OnboardingTopAuctionLots"
import { OnboardingTopAuctionLotsCollection } from "./OnboardingTopAuctionLotsCollection"
import { OnboardingWelcomeScreen } from "./OnboardingWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type OnboardingNavigationStack = {
  OnboardingWelcomeScreen: undefined
  OnboardingQuestionOne: undefined
  OnboardingQuestionTwo: undefined
  OnboardingQuestionThree: undefined
  OnboardingArtistsOnTheRise: undefined
  OnboardingCuratedArtworks: undefined
  OnboardingTopAuctionLots: undefined
  OnboardingFollowArtists: undefined
  OnboardingFollowGalleries: undefined
  OnboardingPostFollowLoadingScreen: undefined
  OnboardingTopAuctionLotsCollection: undefined
  OnboardingArtistsOnTheRiseCollection: undefined
  OnboardingCuratedArtworksCollection: undefined
}

const StackNavigator = createStackNavigator<OnboardingNavigationStack>()

export const OnboardingV2 = () => {
  const { trackCompletedOnboarding } = useOnboardingTracking()

  const onDone = () => {
    trackCompletedOnboarding()
    GlobalStore.actions.auth.setState({ onboardingState: "complete" })
  }

  const { commitMutation } = useUpdateUserProfile(onDone)

  const handleDone = () => {
    commitMutation({
      completedOnboarding: true,
    })
  }

  return (
    <OnboardingProvider onDone={handleDone}>
      <NavigationContainer independent>
        <StackNavigator.Navigator
          screenOptions={{
            ...TransitionPresets.DefaultTransition,
            headerShown: false,
            headerMode: "screen",
            gestureEnabled: false,
          }}
        >
          <StackNavigator.Screen
            name="OnboardingWelcomeScreen"
            component={OnboardingWelcomeScreen}
          />
          <StackNavigator.Screen name="OnboardingQuestionOne" component={OnboardingQuestionOne} />
          <StackNavigator.Screen name="OnboardingQuestionTwo" component={OnboardingQuestionTwo} />
          <StackNavigator.Screen
            name="OnboardingQuestionThree"
            component={OnboardingQuestionThree}
          />

          <StackNavigator.Screen
            name="OnboardingTopAuctionLots"
            component={OnboardingTopAuctionLots}
          />
          <StackNavigator.Screen
            name="OnboardingArtistsOnTheRise"
            component={OnboardingArtistsOnTheRise}
          />
          <StackNavigator.Screen
            name="OnboardingCuratedArtworks"
            component={OnboardingCuratedArtworks}
          />

          <StackNavigator.Screen
            name="OnboardingTopAuctionLotsCollection"
            component={OnboardingTopAuctionLotsCollection}
          />
          <StackNavigator.Screen
            name="OnboardingArtistsOnTheRiseCollection"
            component={OnboardingArtistsOnTheRiseCollection}
          />
          <StackNavigator.Screen
            name="OnboardingCuratedArtworksCollection"
            component={OnboardingCuratedArtworksCollection}
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
