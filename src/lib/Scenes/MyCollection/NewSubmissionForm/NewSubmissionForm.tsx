import { Theme } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import Overview from "./../../Consignments/Screens/Overview"

export const NewSubmissionForm = () => {
  const initialRoute = { component: Overview }

  return (
    <Theme>
      <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
    </Theme>
  )
}
