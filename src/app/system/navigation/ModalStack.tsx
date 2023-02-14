import { NavigationContainer, Route } from "@react-navigation/native"
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack"
import { Severity, addBreadcrumb } from "@sentry/react-native"
import { AppModule, modules } from "app/AppRegistry"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { logNavigation } from "app/utils/loggers"
import { Platform } from "react-native"
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
    <NavigationContainer
      ref={__unsafe_mainModalStackRef}
      initialState={initialState}
      onStateChange={() => {
        const currentRoute = __unsafe_mainModalStackRef.current?.getCurrentRoute()

        console.log("CURRENT :: ", currentRoute)

        if (currentRoute) {
          const params = currentRoute.params as any

          if (__DEV__ && logNavigation) {
            console.log(
              `navigated to ${params.moduleName} ${
                params.props ? JSON.stringify(params.props) : ""
              } `
            )
          }

          addBreadcrumb({
            message: `navigated to ${params.moduleName}`,
            category: "navigation",
            data: { ...params },
            level: Severity.Info,
          })
        }
      }}
    >
      <Stack.Navigator
        screenOptions={({ route }) => {
          const rootModuleName: AppModule | undefined = (route.params as any)?.rootModuleName
          let cardStyleInterpolator: StackCardStyleInterpolator | undefined

          // Note: Modal screens always opens at full height on Android
          if (Platform.OS === "ios" && rootModuleName) {
            const module = modules[rootModuleName]

            if (module.options.modalPresentationStyle === "fullScreen") {
              cardStyleInterpolator = CardStyleInterpolators.forVerticalIOS
            }
          }

          return {
            presentation: "modal",
            headerShown: false,
            cardStyle: { backgroundColor: "white" },
            cardStyleInterpolator,
          }
        }}
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
