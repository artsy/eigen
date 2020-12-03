import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { last } from "lodash"
import React, { RefObject, useEffect, useRef, useState } from "react"
import { SafeAppModule, safeModules } from "./AppModules"
import { BackButton } from "./navigation/BackButton"

const StackNavigator = createStackNavigator()

export const NavStack = React.forwardRef<NavigationContainerRef, { rootModuleName: SafeAppModule }>(
  ({ rootModuleName }, ref) => {
    const ourRef = useRef<NavigationContainerRef>()
    const [visibleBackButton, setVisibleBackButton] = useState(false)

    useEffect(() => {
      const maybeHideBackButton = () => {
        const state = ourRef.current?.getRootState()!

        if (state.routes.length === 1) {
          setVisibleBackButton(false)
          return
        }

        if (safeModules[last(state.routes)?.name as SafeAppModule].options.hidesBackButton === true) {
          setVisibleBackButton(false)
          return
        }

        setVisibleBackButton(true)
      }

      ourRef?.current?.addListener("state", maybeHideBackButton)

      return () => {
        ourRef.current?.removeListener("state", maybeHideBackButton)
      }
    }, [])

    return (
      <NavigationContainer
        ref={(r) => {
          ourRef.current = r
          ref(r)
        }}
      >
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
              <StackNavigator.Screen
                key={moduleName}
                name={moduleName}
                component={module.Component}
              ></StackNavigator.Screen>
            )
          })}
        </StackNavigator.Navigator>
        <BackButton visible={visibleBackButton} />
      </NavigationContainer>
    )
  }
)
