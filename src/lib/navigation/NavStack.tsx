import { NavigationContainer, NavigationContainerRef, Route } from "@react-navigation/native"
import { AppModule, modules } from "lib/AppRegistry"
import { __unsafe_modalNavStackRefs } from "lib/NativeModules/ARScreenPresenterModule"
import React, { useEffect, useRef } from "react"
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

export const ModalNavStack: React.FC<{ route: Route<"", { rootModuleName: AppModule; rootModuleProps?: object }> }> = ({
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

export const NavStack = React.forwardRef<
  NavigationContainerRef,
  { id?: string; rootModuleName: AppModule; rootModuleProps?: object }
>(({ id, rootModuleName, rootModuleProps }, ref) => {
  const navigationContainerProps = useDevReloadNavState(id, ref as any)
  if (navigationContainerProps === null) {
    return null
  }
  const initialParams: ScreenProps = {
    moduleName: rootModuleName,
    props: rootModuleProps,
  }
  return (
    <NavigationContainer ref={ref} independent {...navigationContainerProps}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "white" } }}>
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
