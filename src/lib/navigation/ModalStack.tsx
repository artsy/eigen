import { NavigationContainer, Route } from "@react-navigation/native"
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { AppModule } from "lib/AppRegistry"
import { __unsafe_mainModalStackRef, ScreenParams } from "lib/NativeModules/ARScreenPresenterModule"
import React from "react"
import { Platform } from "react-native"
import { NavStack } from "./NavStack"
import { useReloadedDevNavigationState } from "./useReloadedDevNavigationState"

// tslint:disable-next-line:interface-over-type-literal
export type ModalNavStack = {
  root: ScreenParams
  modal: ScreenParams
}

const Stack = createStackNavigator<ModalNavStack>()

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
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "white" },
          // This is needed in order to get the screen in the background to fade
          cardOverlayEnabled: true,
        }}
      >
        <Stack.Screen name="root">{() => children}</Stack.Screen>
        <Stack.Screen
          name="modal"
          component={ModalNavStack}
          options={({ route: { params } }) => {
            const transition =
              Platform.OS === "ios"
                ? params.rootModuleProps?.modalPresentationStyle !== "fullScreen"
                  ? TransitionPresets.ModalPresentationIOS
                  : TransitionPresets.ModalSlideFromBottomIOS
                : TransitionPresets.FadeFromBottomAndroid
            return {
              ...transition,
            }
          }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const ModalNavStack: React.FC<{ route: Route<"", ScreenParams> }> = ({ route }) => {
  return (
    <NavStack
      id={route.key}
      rootModuleName={route.params.rootModuleName}
      rootModuleProps={{ ...route.params.rootModuleProps, isPresentedModally: true }}
    />
  )
}
