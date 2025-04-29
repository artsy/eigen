import { Screen, useColor } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
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
    <NavigationIndependentTree>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: color("background") },
          }}
        >
          <Stack.Screen
            name="MyProfileHeaderMyCollectionAndSavedWorks"
            component={MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer}
          />
          <Stack.Screen
            name="MyCollectionArtworkForm"
            // @ts-expect-error
            component={MyCollectionArtworkForm}
          />
          <Stack.Screen name="MyProfileEditForm" component={MyProfileEditFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
})

export const MyProfileNew: React.FC<MyProfileProps> = memo(() => {
  return (
    <Screen>
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
