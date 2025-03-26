import { Screen, useColor } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { MyCollectionArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyProfileSettings } from "app/Scenes/MyProfile/MyProfileSettings"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { memo } from "react"
import { MyProfileEditFormScreen } from "./MyProfileEditForm"
import { MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer } from "./MyProfileHeaderMyCollectionAndSavedWorks"

const Stack = createStackNavigator()

type MyProfileProps = StackScreenProps<any>

export const MyProfileLegacy: React.FC<MyProfileProps> = memo(() => {
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

export const MyProfileNew: React.FC<MyProfileProps> = memo(() => {
  return (
    <Screen>
      <Screen.AnimatedHeader title="Account" hideLeftElements />
      <Screen.StickySubHeader title="Account" />
      <Screen.Body fullwidth>
        <MyProfileSettings />
      </Screen.Body>
    </Screen>
  )
})

export const MyProfile: React.FC<MyProfileProps> = memo((props) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return <MyProfileNew {...props} />
  }

  return <MyProfileLegacy {...props} />
})
