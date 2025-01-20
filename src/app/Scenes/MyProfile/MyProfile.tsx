import { useColor } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { MyCollectionArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { memo } from "react"
import { MyProfileEditFormScreen } from "./MyProfileEditForm"
import { MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer } from "./MyProfileHeaderMyCollectionAndSavedWorks"

const Stack = createStackNavigator()

type MyProfileProps = StackScreenProps<any>

export const MyProfile: React.FC<MyProfileProps> = memo(() => {
  const color = useColor()
  const theme = useNavigationTheme()

  return (
    <NavigationContainer independent theme={theme}>
      <Stack.Navigator
        // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: color("background") },
        }}
      >
        <Stack.Screen
          name="MyProfileHeaderMyCollectionAndSavedWorks"
          component={MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer}
        />
        <Stack.Screen name="MyCollectionArtworkForm" component={MyCollectionArtworkForm} />
        <Stack.Screen name="MyProfileEditForm" component={MyProfileEditFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})
