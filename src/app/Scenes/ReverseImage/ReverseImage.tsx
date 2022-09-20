import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { useEffect, useState } from "react"
import { Camera, CameraPermissionStatus } from "react-native-vision-camera"
import { ReverseImageContext, ReverseImageContextValue } from "./ReverseImageContext"
import { ReverseImageArtworkNotFoundScreen } from "./Screens/ArtworkNotFound/ReverseImageArtworkNotFoundScreen"
import { ReverseImageCameraScreen } from "./Screens/Camera/ReverseImageCamera"
import { ReverseImageMultipleResultsScreen } from "./Screens/MultipleResults/ReverseImageMultipleResults"
import { PermissionsPage } from "./Screens/PermissionsPage/PermissionsPage"
import { ReverseImagePreviewScreen } from "./Screens/Preview/ReverseImagePreview"
import { ReverseImageNavigationStack, ReverseImageOwner } from "./types"

interface ReverseImageProps {
  owner: ReverseImageOwner
}

const Stack = createStackNavigator<ReverseImageNavigationStack>()

export const ReverseImage: React.FC<ReverseImageProps> = ({ owner }) => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>()
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>()

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission)
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
  }, [])

  const contextValue: ReverseImageContextValue = {
    analytics: {
      owner,
    },
  }

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null
  }

  const hasPermissions = cameraPermission === "authorized" && microphonePermission === "authorized"

  console.log("[debug] cameraPermission", cameraPermission)
  console.log("[debug] microphonePermission", microphonePermission)
  console.log("[debug] showPermissionsPage", hasPermissions)
  console.log("[debug] route", hasPermissions ? "Camera" : "PermissionsPage")

  return (
    <ReverseImageContext.Provider value={contextValue}>
      <NavigationContainer independent>
        <Stack.Navigator
          initialRouteName={hasPermissions ? "Camera" : "PermissionsPage"}
          screenOptions={{
            headerShown: false,
            headerMode: "screen",
            animationTypeForReplace: "push",
          }}
        >
          <Stack.Screen name="Camera" component={ReverseImageCameraScreen} />
          <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
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
