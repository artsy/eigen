import React from "react"
import { Theme } from "@artsy/palette"
import Overview from "./../../Consignments/Screens/Overview"
import NavigatorIOS from "react-native-navigator-ios"

export const NewSubmissionForm = () => {
  const initialRoute = { component: Overview }

  return (
    <Theme>
      <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
    </Theme>
  )
}
