import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { AppModule, modules } from "lib/AppRegistry"
import React from "react"
import { View } from "react-native"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { BackButton } from "./BackButton"

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
      {module.options.hidesBackButton ? (
        <module.Component {...route.params.props} />
      ) : (
        <BackButtonPageWrapper>
          <module.Component {...route.params.props} />
        </BackButtonPageWrapper>
      )}
    </View>
  )
}

export const ModalNavStack = React.forwardRef<
  NavigationContainerRef,
  { route: { params: { rootModuleName: AppModule; rootModuleProps?: object } } }
>(({ route }, ref) => {
  return (
    <NavStack ref={ref} rootModuleName={route.params.rootModuleName} rootModuleProps={route.params.rootModuleProps} />
  )
})

export const NavStack = React.forwardRef<
  NavigationContainerRef,
  { rootModuleName: AppModule; rootModuleProps?: object }
>(({ rootModuleName, rootModuleProps }, ref) => {
  const initialParams: ScreenProps = {
    moduleName: rootModuleName,
    props: rootModuleProps,
  }
  return (
    <NavigationContainer ref={ref} independent>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}
        initialRouteName={rootModuleName}
      >
        <Stack.Screen name="screen" component={ScreenWrapper} initialParams={initialParams} />
      </Stack.Navigator>
    </NavigationContainer>
  )
})

const BackButtonPageWrapper: React.FC<{}> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <BackButton />
    </View>
  )
}
