import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { View } from "react-native"
import { SafeAppModule, safeModules } from "./AppModules"
import { BackButton } from "./navigation/BackButton"

const StackNavigator = createStackNavigator()

export const NavStack = React.forwardRef<NavigationContainerRef, { rootModuleName: SafeAppModule }>(
  ({ rootModuleName }, ref) => {
    return (
      <NavigationContainer ref={ref}>
        <StackNavigator.Navigator
          screenOptions={{ headerShown: false, cardStyle: { backgroundColor: "white" } }}
          initialRouteName={rootModuleName}
        >
          {Object.keys(safeModules).map((moduleName) => {
            const module = safeModules[moduleName as keyof typeof safeModules]
            if (module.type !== "react") {
              return null
            }
            return (
              <StackNavigator.Screen key={moduleName} name={moduleName}>
                {({ route }) => {
                  return module.options.hidesBackButton ? (
                    <module.Component {...route.params} />
                  ) : (
                    <BackButtonPageWrapper>
                      <module.Component {...route.params} />
                    </BackButtonPageWrapper>
                  )
                }}
              </StackNavigator.Screen>
            )
          })}
        </StackNavigator.Navigator>
      </NavigationContainer>
    )
  }
)

const BackButtonPageWrapper: React.FC<{}> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <BackButton />
    </View>
  )
}
