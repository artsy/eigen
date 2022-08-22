import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useEffect } from "react"
import { Platform, StatusBar } from "react-native"
import { ReverseImageArtworkNotFoundScreen } from "./Screens/ArtworkNotFound/ReverseImageArtworkNotFoundScreen"
import { ReverseImageCameraScreen } from "./Screens/Camera/ReverseImageCamera"
import { ReverseImageMultipleResultsScreen } from "./Screens/MultipleResults/ReverseImageMultipleResults"
import { ReverseImagePreviewScreen } from "./Screens/Preview/ReverseImagePreview"
import { ReverseImageNavigationStack } from "./types"

const Stack = createStackNavigator<ReverseImageNavigationStack>()

export const ReverseImage = () => {
  useEffect(() => {
    StatusBar.setBarStyle("light-content")

    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent")
    }

    return () => {
      // restore the previous color for the status bar, as on all other screens
      StatusBar.setBarStyle("dark-content")

      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent")
      }
    }
  }, [])

  return (
    <NavigationContainer independent>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{
          headerShown: false,
          headerMode: "screen",
          animationTypeForReplace: "push",
        }}
      >
        <Stack.Screen name="Camera" component={ReverseImageCameraScreen} />
        <Stack.Screen name="MultipleResults" component={ReverseImageMultipleResultsScreen} />
        <Stack.Screen name="ArtworkNotFound" component={ReverseImageArtworkNotFoundScreen} />
        <Stack.Screen
          name="Preview"
          component={ReverseImagePreviewScreen}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
