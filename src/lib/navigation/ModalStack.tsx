import { NavigationContainer } from "@react-navigation/native"
import { __unsafe_mainModalStackRef } from "lib/NativeModules/ARScreenPresenterModule"
import React from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { ModalNavStack } from "./NavStack"
import { useDevReloadNavState } from "./useDevReloadNavState"

const Stack = createNativeStackNavigator()

export const ModalStack: React.FC = ({ children }) => {
  const navigationContainerProps = useDevReloadNavState("main_modal_stack", __unsafe_mainModalStackRef)
  if (!navigationContainerProps) {
    return null
  }
  return (
    <NavigationContainer independent={true} ref={__unsafe_mainModalStackRef} {...navigationContainerProps}>
      <Stack.Navigator mode="modal" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="root">{() => children}</Stack.Screen>
        <Stack.Screen name="modal" component={ModalNavStack}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
