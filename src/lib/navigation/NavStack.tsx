import { NavigationContainer, NavigationContainerRef, Route, useNavigationState } from "@react-navigation/native"
import { AppModule, modules } from "lib/AppRegistry"
import React from "react"
import { View } from "react-native"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { BackButton } from "./BackButton"
import { useDevReloadNavState } from "./useDevReloadNavState"

const Stack = createNativeStackNavigator()

interface ScreenProps {
  moduleName: AppModule
  props?: object
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

  const isRootScreen = useNavigationState((state) => state.routes[0].key === route.key)
  const showBackButton = !isRootScreen && !module.options.hidesBackButton

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <module.Component {...route.params.props} />
      {!!showBackButton && <BackButton />}
    </View>
  )
}

/**
 * NavStack is a native navigation stack. Each tab in the main view has its own NavStack. Each modal that
 * is presented (excluding FancyModal) also has its own NavStack.
 */
export const NavStack = React.forwardRef<
  NavigationContainerRef,
  { id?: string; rootModuleName: AppModule; rootModuleProps?: object }
>(({ id, rootModuleName, rootModuleProps }, ref) => {
  useDevReloadNavState(id, ref as any)
  const initialParams: ScreenProps = {
    moduleName: rootModuleName,
    props: rootModuleProps,
  }
  return (
    <NavigationContainer ref={ref} independent>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="screen" component={ScreenWrapper} initialParams={initialParams} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})
