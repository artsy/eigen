import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { MyCollectionArtworkForm } from "../MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyProfileEditFormScreen } from "./MyProfileEditForm"
import { MyProfileHeaderMyCollectionAndSavedWorksQueryRenderer } from "./MyProfileHeaderMyCollectionAndSavedWorks"
import { MyProfileProvider } from "./MyProfileProvider"

const Stack = createStackNavigator()

export const MyProfile = () => {
  return (
    <MyProfileProvider>
      <NavigationContainer independent>
        <Stack.Navigator
          // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
          detachInactiveScreens={false}
          screenOptions={{
            headerShown: false,
            safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
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
    </MyProfileProvider>
  )
}
