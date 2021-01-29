import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
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

const ScreenWrapper: React.FC<{ route: { params: ScreenProps } }> = ({ route }) => {
  const module = modules[route.params.moduleName]
  if (module.type !== "react") {
    console.warn(route.params.moduleName, { module })
    throw new Error("native modules not supported on android")
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <module.Component {...route.params.props} />
      {!module.options.hidesBackButton && <BackButton />}
    </View>
  )
}

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
