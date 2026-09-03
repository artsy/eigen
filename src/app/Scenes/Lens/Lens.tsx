import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
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
 * `detachInactiveScreens={false}` is retained from the previous ReverseImage implementation, where
 * detaching screens could freeze camera capture. Do not remove it without testing the full flow on
 * physical iOS and Android devices.
 */
export const Lens: React.FC = () => {
  const theme = useNavigationTheme()

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Stack.Navigator
          detachInactiveScreens={false}
          initialRouteName="LensCamera"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LensCamera" component={LensCamera} />
          <Stack.Screen
            name="LensAnalyzing"
            component={LensAnalyzing}
            options={{ animation: "fade" }}
          />
          <Stack.Screen
            name="LensResults"
            component={LensResultsScreen}
            options={{ animation: "fade" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}
