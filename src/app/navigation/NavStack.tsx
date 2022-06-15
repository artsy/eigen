import { Route, useIsFocused, useNavigationState } from "@react-navigation/native"
import { AppModule, modules } from "app/AppRegistry"
import { isPad } from "app/utils/hardware"
import React, { useState } from "react"
import { View } from "react-native"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { ProvideScreenDimensions, useScreenDimensions } from "shared/hooks"
import { ArtsyKeyboardAvoidingViewContext } from "shared/utils"
import { BackButton } from "./BackButton"

const Stack = createNativeStackNavigator()

interface ScreenProps {
  moduleName: AppModule
  props?: object
  stackID: string
}

/**
 * ScreenWrapper renders a given app module as a screen in a NavStack. It is responsible for showing the back button
 * when the screen needs one.
 */
const ScreenWrapper: React.FC<{ route: Route<"", ScreenProps> }> = ({ route }) => {
  const module = modules[route.params.moduleName]

  // tslint:disable-next-line:variable-name
  const [legacy_shouldHideBackButton, updateShouldHideBackButton] = useState(false)

  const isRootScreen = useNavigationState((state) => state.routes[0].key === route.key)
  const showBackButton =
    !isRootScreen && !module.options.hidesBackButton && !legacy_shouldHideBackButton

  const isPresentedModally = (route.params.props as any)?.isPresentedModally

  const isVisible = useIsFocused()

  return (
    <LegacyBackButtonContext.Provider value={{ updateShouldHideBackButton }}>
      <ProvideScreenDimensions>
        <ArtsyKeyboardAvoidingViewContext.Provider
          value={{ isPresentedModally, isVisible, bottomOffset: 0 }}
        >
          <ScreenPadding
            isPresentedModally={isPresentedModally}
            isVisible={isVisible}
            fullBleed={!!module.options.fullBleed}
          >
            <module.Component {...route.params.props} isVisible={isVisible} />
            <BackButton show={showBackButton} />
          </ScreenPadding>
        </ArtsyKeyboardAvoidingViewContext.Provider>
      </ProvideScreenDimensions>
    </LegacyBackButtonContext.Provider>
  )
}

const ScreenPadding: React.FC<{
  fullBleed: boolean
  isPresentedModally: boolean
  isVisible: boolean
}> = ({ fullBleed, children }) => {
  const topInset = useScreenDimensions().safeAreaInsets.top
  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingTop: fullBleed ? 0 : topInset }}>
      {children}
    </View>
  )
}

/**
 * NavStack is a native navigation stack. Each tab in the main view has its own NavStack. Each modal that
 * is presented (excluding FancyModal) also has its own NavStack.
 */
export const NavStack: React.FC<{
  id: string
  rootModuleName: AppModule
  rootModuleProps?: any
}> = ({ id, rootModuleName, rootModuleProps }) => {
  const initialParams: ScreenProps = {
    moduleName: rootModuleName,
    props: rootModuleProps,
    stackID: id,
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        stackAnimation: rootModuleProps?.isPresentedModally ? "slide_from_right" : undefined,
        contentStyle: { backgroundColor: "white" },
        screenOrientation: isPad() ? "default" : "portrait",
      }}
    >
      <Stack.Screen name={"screen:" + id} component={ScreenWrapper} initialParams={initialParams} />
    </Stack.Navigator>
  )
}

export const LegacyBackButtonContext = React.createContext<{
  updateShouldHideBackButton(shouldHideBackButton: boolean): void
}>({
  updateShouldHideBackButton() {
    if (__DEV__) {
      console.error("no LegacyBackButtonContext in tree")
    }
  },
})
