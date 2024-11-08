import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack"
import { MyCollectionArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyProfileEditFormScreen } from "./MyProfileEditForm"
import { MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer } from "./MyProfileHeaderMyCollectionAndSavedWorks"

const Stack = createStackNavigator()

type MyProfileProps = StackScreenProps<any>

export const MyProfile: React.FC<MyProfileProps> = () => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "white" },
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
}
