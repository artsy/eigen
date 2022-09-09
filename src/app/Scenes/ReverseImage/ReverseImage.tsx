import { NavigationContainer, useFocusEffect } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  ArtsyNativeModule,
  DEFAULT_NAVIGATION_BAR_COLOR,
} from "app/NativeModules/ArtsyNativeModule"
import { useCallback, useEffect } from "react"
import { Platform, StatusBar } from "react-native"
import { ReverseImageContext, ReverseImageContextValue } from "./ReverseImageContext"
import { ReverseImageArtworkNotFoundScreen } from "./Screens/ArtworkNotFound/ReverseImageArtworkNotFoundScreen"
import { ReverseImageCameraScreen } from "./Screens/Camera/ReverseImageCamera"
import { ReverseImageMultipleResultsScreen } from "./Screens/MultipleResults/ReverseImageMultipleResults"
import { ReverseImagePreviewScreen } from "./Screens/Preview/ReverseImagePreview"
import { ReverseImageNavigationStack, ReverseImageOwner } from "./types"

interface ReverseImageProps {
  owner: ReverseImageOwner
}

const Stack = createStackNavigator<ReverseImageNavigationStack>()

export const ReverseImage: React.FC<ReverseImageProps> = ({ owner }) => {
  const updateStatusBar = useCallback(() => {
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

  useEffect(() => {
    if (Platform.OS !== "android") {
      return
    }

    ArtsyNativeModule.setNavigationBarColor("#000000")
    ArtsyNativeModule.setAppLightContrast(true)

    return () => {
      ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
      ArtsyNativeModule.setAppLightContrast(false)
    }
  }, [])

  useFocusEffect(updateStatusBar)

  const contextValue: ReverseImageContextValue = {
    analytics: {
      owner,
    },
  }

  return (
    <ReverseImageContext.Provider value={contextValue}>
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
    </ReverseImageContext.Provider>
  )
}
