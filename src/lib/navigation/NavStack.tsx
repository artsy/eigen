import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AppModule, modules } from "lib/AppRegistry"
import React from "react"
import { View } from "react-native"
import { BackButton } from "./BackButton"

const StackNavigator = createStackNavigator()

export const NavStack = React.forwardRef<NavigationContainerRef, { rootModuleName: AppModule }>(
  ({ rootModuleName }, ref) => {
    return (
      <NavigationContainer ref={ref}>
        <StackNavigator.Navigator
          screenOptions={{ headerShown: false, cardStyle: { backgroundColor: "white" } }}
          initialRouteName={rootModuleName}
        >
          {Object.keys(modules).map((moduleName) => {
            const module = modules[moduleName as keyof typeof modules]
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
