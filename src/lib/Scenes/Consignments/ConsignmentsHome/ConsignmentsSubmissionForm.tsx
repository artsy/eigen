import Overview from "lib/Scenes/Consignments/Screens/Overview"
import { color } from "palette"
import React from "react"
import { View } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

export const ConsignmentsSubmissionForm: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS initialRoute={{ component: Overview }} navigationBarHidden={true} style={{ flex: 1 }} />
      {/* drag handle */}
      <View style={{ position: "absolute", top: 10, left: 0, right: 0, alignItems: "center" }}>
        <View style={{ width: 75, height: 4, borderRadius: 2, backgroundColor: color("black30") }}></View>
      </View>
    </View>
  )
}
