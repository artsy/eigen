import { AppStore } from "lib/store/AppStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { useEffect } from "react"
import React from "react"
import NavigatorIOS, { Route } from "react-native-navigator-ios"

export const Navigator: React.FC<Route> = ({ children, title = "" }) => {
  const dimensions = useScreenDimensions()

  return (
    <NavigatorIOS
      navigationBarHidden={true}
      style={{ height: dimensions.height }}
      initialRoute={{
        title,
        component: ({ navigator }) => {
          useNavigator(navigator)
          return <>{children}</>
        },
      }}
    />
  )
}

export function useNavigator(newNavigator: NavigatorIOS) {
  const navActions = AppStore.actions.myCollection.navigation

  useEffect(() => {
    navActions.setNavigator(newNavigator)
  }, [])

  return newNavigator
}
