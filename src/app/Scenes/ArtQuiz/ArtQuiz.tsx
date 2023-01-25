import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import {
  ArtQuizResultsNavigation,
  ArtQuizResultsNavigationScreens,
} from "app/Scenes/ArtQuiz/ArtQuizResults/navigation"
import { ArtQuizArtworks } from "./ArtQuizArtworks"
import { ArtQuizWelcome } from "./ArtQuizWelcome"

// tslint:disable-next-line:interface-over-type-literal
export type ArtQuizNavigationStack = {
  ArtQuizWelcome: undefined
  ArtQuizArtworks: undefined
} & ArtQuizResultsNavigationScreens

export const StackNavigator = createStackNavigator<ArtQuizNavigationStack>()

export const ArtQuiz: React.FC = () => {
  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        screenOptions={{
          ...TransitionPresets.DefaultTransition,
          headerShown: false,
          headerMode: "screen",
          gestureEnabled: false,
        }}
      >
        <StackNavigator.Screen name="ArtQuizWelcome" component={ArtQuizWelcome} />
        <StackNavigator.Screen name="ArtQuizArtworks" component={ArtQuizArtworks} />
        {ArtQuizResultsNavigation()}
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}
