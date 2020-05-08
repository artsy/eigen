import React from "react"
import { Theme } from "@artsy/palette"
import NavigatorIOS from "react-native-navigator-ios"
import { BlankSlate } from "./Screens/BlankSlate"
import { Dashboard } from "./Screens/Dashboard"
import SwitchBoard from "../../NativeModules/SwitchBoard"

interface SellDashboardProps {}

export class SellDashboard extends React.Component<SellDashboardProps, any> {
  render() {
    const routeTo = (route: string): void => {
      SwitchBoard.presentModalViewController(this, route)
    }

    // ultimately i think this will check to see if the "my-collection"
    // collection exists and if there are any artworks in it.
    const showBlankSlate = false
    if (showBlankSlate) return <BlankSlate routeTo={routeTo} />

    const initialRoute = {
      component: Dashboard,
      passProps: { routeTo },
      title: "Evaluate & Sell",
    }

    return (
      <Theme>
        <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
      </Theme>
    )
  }
}
