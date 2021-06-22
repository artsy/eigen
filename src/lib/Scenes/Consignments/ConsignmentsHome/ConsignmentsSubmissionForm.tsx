import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"
import { ConnectedOverview as Overview } from "../Screens/Overview"

export interface ConsignmentsSubmissionFormProps {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionFormProps> = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS initialRoute={{ component: Overview, passProps: { params: props } }} />
    </View>
  )
}
