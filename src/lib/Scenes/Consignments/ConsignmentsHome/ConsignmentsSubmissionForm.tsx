import Overview from "lib/Scenes/Consignments/Screens/Overview"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

export const ConsignmentsSubmissionForm: React.FC = () => {
  return <NavigatorIOS initialRoute={{ component: Overview }} navigationBarHidden={true} style={{ flex: 1 }} />
}
