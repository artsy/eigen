import { NavigationContainer } from "@react-navigation/native"
import { __unsafe_modalStackRef } from "lib/NativeModules/ARScreenPresenterModule"
import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { ModalNavStack } from "./NavStack"

const Stack = createNativeStackNavigator()

export const ModalStack: React.FC = ({ children }) => {
  return (
    <NavigationContainer independent={true} ref={__unsafe_modalStackRef}>
      <Stack.Navigator mode="modal" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="root">{() => children}</Stack.Screen>
        <Stack.Screen name="modal" component={ModalNavStack}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
