import Overview from "lib/Scenes/Consignments/Screens/Overview"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"

export const ConsignmentsSubmissionForm: React.FC = () => {
  const initialRoute = { component: Overview }

  return <NavigatorIOS initialRoute={initialRoute} />
}
