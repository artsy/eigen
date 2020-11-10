import Overview from "lib/Scenes/Consignments/Screens/Overview"
import { Theme } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

export const ConsignmentsSubmissionForm: React.FC = () => {
  const initialRoute = { component: Overview }

  return (
    <Theme>
      <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
    </Theme>
  )
}
