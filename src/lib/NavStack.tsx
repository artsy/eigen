import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { SafeAppModule, safeModules } from "./AppModules"

const StackNavigator = createStackNavigator()

export const NavStack = React.forwardRef<NavigationContainerRef, { rootModuleName: SafeAppModule }>(
  ({ rootModuleName }, ref) => {
    return (
      <NavigationContainer ref={ref}>
        <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName={rootModuleName}>
          {Object.keys(safeModules).map((moduleName) => {
            const module = safeModules[moduleName as keyof typeof safeModules]
            if (module.type !== "react") {
              return null
            }
            return (
              <StackNavigator.Screen
                key={moduleName}
                name={moduleName}
                component={module.Component}
              ></StackNavigator.Screen>
            )
          })}
        </StackNavigator.Navigator>
      </NavigationContainer>
    )
  }
)
