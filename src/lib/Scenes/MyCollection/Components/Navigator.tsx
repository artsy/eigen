import { AppStore } from "lib/store/AppStore"
import { useEffect } from "react"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

/**
 * Navigator is a helper component for automatically connecting a component tree
 * to State/MyCollectionNavigationModel. When wrapped, we can dispatch actions
 * and push / pop views from a central location (the model) to NavigatorIOS.
 */

export type NavigatorTarget = "main" | "modal"

export interface NavigatorProps {
  navigator?: NavigatorIOS
  name: NavigatorTarget
  title?: string
}

export const Navigator: React.FC<NavigatorProps> = ({ children, name, title = "" }) => {
  return (
    <NavigatorIOS
      navigationBarHidden={true}
      style={{ flex: 1 }}
      initialRoute={{
        title,
        component: ({ navigator }) => {
          const navActions = AppStore.actions.myCollection.navigation

          useEffect(() => {
            navActions.addNavigator({ navigator, name })
          }, [])

          return <>{children}</>
        },
      }}
    />
  )
}
