import {
  NavigationContainer,
  NavigationContainerRef,
  Route,
  useIsFocused,
  useNavigationState,
} from "@react-navigation/native"
import { AppModule, modules } from "lib/AppRegistry"
import { ArtsyKeyboardAvoidingViewContext } from "lib/Components/ArtsyKeyboardAvoidingView"
import { useSelectedTab } from "lib/store/GlobalStore"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useState } from "react"
import { View } from "react-native"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { BackButton } from "./BackButton"
import { useReloadedDevNavigationState } from "./useReloadedDevNavigationState"

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
  if (module.type !== "react") {
    console.warn(route.params.moduleName, { module })
    throw new Error("native modules not yet supported in new nav setup")
  }
  // tslint:disable-next-line:variable-name
  const [legacy_shouldHideBackButton, updateShouldHideBackButton] = useState(false)

  const isRootScreen = useNavigationState((state) => state.routes[0].key === route.key)
  const showBackButton = !isRootScreen && !module.options.hidesBackButton && !legacy_shouldHideBackButton

  const isPresentedModally = (route.params.props as any)?.isPresentedModally

  const isMountedInCurrentTab = useSelectedTab() === route.params.stackID
  const isVisible = useIsFocused() && (isPresentedModally || isMountedInCurrentTab)

  return (
    <LegacyBackButtonContext.Provider value={{ updateShouldHideBackButton }}>
      <ProvideScreenDimensions>
        <ArtsyKeyboardAvoidingViewContext.Provider value={{ isPresentedModally, isVisible, bottomOffset: 0 }}>
          <ScreenPadding
            isPresentedModally={isPresentedModally}
            isVisible={isVisible}
            fullBleed={!!module.options.fullBleed}
          >
            <module.Component {...route.params.props} />
            <BackButton show={showBackButton} />
          </ScreenPadding>
        </ArtsyKeyboardAvoidingViewContext.Provider>
      </ProvideScreenDimensions>
    </LegacyBackButtonContext.Provider>
  )
}

const ScreenPadding: React.FC<{ fullBleed: boolean; isPresentedModally: boolean; isVisible: boolean }> = ({
  fullBleed,
  children,
}) => {
  const topInset = useScreenDimensions().safeAreaInsets.top
  return <View style={{ flex: 1, backgroundColor: "white", paddingTop: fullBleed ? 0 : topInset }}>{children}</View>
}

/**
 * NavStack is a native navigation stack. Each tab in the main view has its own NavStack. Each modal that
 * is presented (excluding FancyModal) also has its own NavStack.
 */
export const NavStack = React.forwardRef<
  NavigationContainerRef,
  { id: string; rootModuleName: AppModule; rootModuleProps?: object }
>(({ id, rootModuleName, rootModuleProps }, ref) => {
  const initialState = useReloadedDevNavigationState(id, ref as any)
  const initialParams: ScreenProps = {
    moduleName: rootModuleName,
    props: rootModuleProps,
    stackID: id,
  }
  return (
    <NavigationContainer ref={ref} independent initialState={initialState}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="screen" component={ScreenWrapper} initialParams={initialParams} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})

export const LegacyBackButtonContext = React.createContext<{
  updateShouldHideBackButton(shouldHideBackButton: boolean): void
}>({
  updateShouldHideBackButton() {
    if (__DEV__) {
      console.error("no LegacyBackButtonContext in tree")
    }
  },
})
