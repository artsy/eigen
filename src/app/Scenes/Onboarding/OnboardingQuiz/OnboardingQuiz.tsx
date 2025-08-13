import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingTracking"
import { GlobalStore } from "app/store/GlobalStore"
import { isTablet } from "react-native-device-info"
import { OnboardingProvider } from "./Hooks/useOnboardingContext"
import { useUpdateUserProfile } from "./Hooks/useUpdateUserProfile"
import { OnboardingArtistsOnTheRise } from "./OnboardingArtistsOnTheRise"
import { OnboardingCuratedArtworks } from "./OnboardingCuratedArtworks"
import { OnboardingFollowArtists } from "./OnboardingFollowArtists"
import { OnboardingFollowGalleries } from "./OnboardingFollowGalleries"
import { OnboardingPostFollowLoadingScreen } from "./OnboardingPostFollowLoadingScreen"
import { OnboardingPriceRange } from "./OnboardingPriceRange"
import { OnboardingQuestionOne } from "./OnboardingQuestionOne"
import { OnboardingQuestionThree } from "./OnboardingQuestionThree"
import { OnboardingQuestionTwo } from "./OnboardingQuestionTwo"
import { OnboardingTopAuctionLots } from "./OnboardingTopAuctionLots"
import { OnboardingWelcomeScreen } from "./OnboardingWelcome"

export type OnboardingNavigationStack = {
  OnboardingWelcomeScreen: undefined
  OnboardingQuestionOne: undefined
  OnboardingQuestionTwo: undefined
  OnboardingQuestionThree: undefined
  OnboardingPriceRange: undefined
  OnboardingArtistsOnTheRise: undefined
  OnboardingCuratedArtworks: undefined
  OnboardingTopAuctionLots: undefined
  OnboardingFollowArtists: undefined
  OnboardingFollowGalleries: undefined
  OnboardingPostFollowLoadingScreen: undefined
}

const StackNavigator = createNativeStackNavigator<OnboardingNavigationStack>()

export const OnboardingQuiz = () => {
  const { trackCompletedOnboarding } = useOnboardingTracking()

  const onDone = () => {
    trackCompletedOnboarding()
    GlobalStore.actions.onboarding.setOnboardingState("complete")
  }

  const { commitMutation } = useUpdateUserProfile(onDone)

  const handleDone = () => {
    commitMutation({
      completedOnboarding: true,
    })
  }

  return (
    <OnboardingProvider onDone={handleDone}>
      <StackNavigator.Navigator
        screenOptions={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: false,
          orientation: !isTablet() ? "portrait" : "default",
        }}
      >
        <StackNavigator.Screen name="OnboardingWelcomeScreen" component={OnboardingWelcomeScreen} />
        <StackNavigator.Screen name="OnboardingQuestionOne" component={OnboardingQuestionOne} />
        <StackNavigator.Screen name="OnboardingQuestionTwo" component={OnboardingQuestionTwo} />
        <StackNavigator.Screen name="OnboardingPriceRange" component={OnboardingPriceRange} />
        <StackNavigator.Screen name="OnboardingQuestionThree" component={OnboardingQuestionThree} />

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

        <StackNavigator.Screen name="OnboardingFollowArtists" component={OnboardingFollowArtists} />
        <StackNavigator.Screen
          name="OnboardingFollowGalleries"
          component={OnboardingFollowGalleries}
        />
        <StackNavigator.Screen
          name="OnboardingPostFollowLoadingScreen"
          component={OnboardingPostFollowLoadingScreen}
        />
      </StackNavigator.Navigator>
    </OnboardingProvider>
  )
}
