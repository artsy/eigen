import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { defaultScreenOrientation } from "app/utils/screenOrientation"
import { FollowArtists } from "./FollowArtists"
import { Introduction } from "./Introduction"

export type NavigationStack = {
  Introduction: undefined
  FollowArtists: undefined
}

const Stack = createNativeStackNavigator<NavigationStack>()

export const Onboarding: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
        gestureEnabled: false,
        orientation: defaultScreenOrientation,
      }}
    >
      <Stack.Screen name="Introduction" component={Introduction} />
      <Stack.Screen name="FollowArtists" component={FollowArtists} />
    </Stack.Navigator>
  )
}
