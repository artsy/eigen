import { NavigationContainer, Route } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AppModule } from "app/AppRegistry"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import React from "react"
import { NavStack } from "./NavStack"
import { useReloadedDevNavigationState } from "./useReloadedDevNavigationState"

const Stack = createStackNavigator()

/**
 * ModalStack is the root navigation stack in the app. The root screen in this stack is
 * the main app (with bottom tabs, etc), and then whenever we present a modal it gets
 * pushed on the top of this stack. We use react-native-screens to get native modal presetation
 * transitions etc.
 */
export const ModalStack: React.FC = ({ children }) => {
  const initialState = useReloadedDevNavigationState("main_modal_stack", __unsafe_mainModalStackRef)
  return (
    <NavigationContainer ref={__unsafe_mainModalStackRef} initialState={initialState}>
      <Stack.Navigator
        mode="modal"
        screenOptions={{ headerShown: false, cardStyle: { backgroundColor: "white" } }}
      >
        <Stack.Screen name="root">{() => children}</Stack.Screen>
        <Stack.Screen name="modal" component={ModalNavStack} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const ModalNavStack: React.FC<{
  route: Route<"", { rootModuleName: AppModule; rootModuleProps?: object }>
}> = ({ route }) => {
  return (
    <NavStack
      id={route.key}
      rootModuleName={route.params.rootModuleName}
      rootModuleProps={{ ...route.params.rootModuleProps, isPresentedModally: true }}
    />
  )
}
