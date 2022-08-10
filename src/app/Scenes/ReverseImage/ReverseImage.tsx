import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ReverseImageArtworkNotFoundScreen } from "./Screens/ArtworkNotFound/ReverseImageArtworkNotFoundScreen"
import { ReverseImageCameraScreen } from "./Screens/Camera/ReverseImageCamera"
import { ReverseImageMultipleResultsScreen } from "./Screens/MultipleResults/ReverseImageMultipleResults"
import { ReverseImagePreviewScreen } from "./Screens/Preview/ReverseImagePreview"
import { ReverseImageNavigationStack } from "./types"

const Stack = createStackNavigator<ReverseImageNavigationStack>()

export const ReverseImage = () => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        initialRouteName="Camera"
        headerMode="screen"
        screenOptions={{
          headerShown: false,
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
