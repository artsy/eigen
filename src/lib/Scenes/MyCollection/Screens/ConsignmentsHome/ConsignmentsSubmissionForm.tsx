import Overview from "lib/Scenes/Consignments/Screens/Overview"
import { Theme } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

export const ConsignmentsSubmissionForm: React.FC<{ isArrivingFromMyCollection?: boolean }> = ({
  isArrivingFromMyCollection,
}) => {
  const initialRoute = { component: Overview, passProps: { isArrivingFromMyCollection } }

  return (
    <Theme>
      <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
    </Theme>
  )
}
