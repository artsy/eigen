import { NavigationContainer, NavigationContainerRef, Route } from "@react-navigation/native"
import { AppModule } from "lib/AppRegistry"
import { __unsafe_mainModalStackRef, __unsafe_modalNavStackRefs } from "lib/NativeModules/ARScreenPresenterModule"
import React, { useEffect, useRef } from "react"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { NavStack } from "./NavStack"
import { useDevReloadNavState } from "./useDevReloadNavState"

const Stack = createNativeStackNavigator()

/**
 * ModalStack is the root navigation stack in the app. The root screen in this stack is
 * the main app (with bottom tabs, etc), and then whenever we present a modal it gets
 * pushed on the top of this stack. We use react-native-screens to get native modal presetation
 * transitions etc.
 */
export const ModalStack: React.FC = ({ children }) => {
  useDevReloadNavState("main_modal_stack", __unsafe_mainModalStackRef)
  return (
    <NavigationContainer independent={true} ref={__unsafe_mainModalStackRef}>
      <Stack.Navigator mode="modal" screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="root">{() => children}</Stack.Screen>
        <Stack.Screen name="modal" component={ModalNavStack}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const ModalNavStack: React.FC<{ route: Route<"", { rootModuleName: AppModule; rootModuleProps?: object }> }> = ({
  route,
}) => {
  const ref = useRef<NavigationContainerRef>(null)
  useEffect(() => {
    __unsafe_modalNavStackRefs[route.key] = ref
    return () => {
      delete __unsafe_modalNavStackRefs[route.key]
    }
  }, [])

  return (
    <NavStack
      id={route.key}
      ref={ref}
      rootModuleName={route.params.rootModuleName}
      rootModuleProps={route.params.rootModuleProps}
    />
  )
}
