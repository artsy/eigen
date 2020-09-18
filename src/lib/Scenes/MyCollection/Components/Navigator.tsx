import { AppStore } from "lib/store/AppStore"
import { useEffect } from "react"
import React from "react"
import NavigatorIOS, { Route } from "react-native-navigator-ios"

/**
 * Navigator is a helper component for automatically connecting a component tree
 * to State/MyCollectionNavigationModel. When wrapped, we can dispatch actions
 * and push / pop views from a central location (the model) to NavigatorIOS.
 */
export const Navigator: React.FC<Route> = ({ children, title = "" }) => {
  return (
    <NavigatorIOS
      navigationBarHidden={true}
      style={{ flex: 1 }}
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
