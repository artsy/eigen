import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { LensAnalyzing } from "app/Scenes/Lens/Screens/LensAnalyzing"
import { LensCamera } from "app/Scenes/Lens/Screens/LensCamera"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { StatusBar } from "react-native"

const Stack = createStackNavigator<LensNavigationStack>()

/**
 * Independent nav stack, per this repo's convention for context-specific flows (AGENTS.md) —
 * modeled on MyCollectionArtworkForm.tsx's NavigationIndependentTree + NavigationContainer +
 * createStackNavigator setup.
 *
 * `detachInactiveScreens={false}` is load-bearing, not incidental: the deleted 2022
 * `ReverseImage.tsx` carries an all-caps warning that `react-native-screens` freezes the camera
 * and makes capture impossible inside a React Native modal (this screen is `alwaysPresentModally`
 * -> `fullScreenModal`, so that exact situation applies here). Do not remove it.
 */
export const Lens: React.FC = () => {
  const theme = useNavigationTheme()

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator
          detachInactiveScreens={false}
          initialRouteName="LensCamera"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LensCamera" component={LensCamera} />
          <Stack.Screen name="LensAnalyzing" component={LensAnalyzing} options={{ animation: "fade" }} />
          <Stack.Screen name="LensResults" component={LensResultsScreen} options={{ animation: "fade" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}
