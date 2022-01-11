import { useFeatureFlag } from "lib/store/GlobalStore"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { View } from "react-native"
import { ConnectedOverview as Overview } from "../Screens/Overview"
import { SubmitArtworkOverview } from "../Screens/SubmitArtworkOverview/SubmitArtworkOverview"

export interface ConsignmentsSubmissionFormProps {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionFormProps> = (props) => {
  const enableNewSWAFlow = useFeatureFlag("AREnableAccordionNavigationOnSubmitArtwork")

  if (enableNewSWAFlow) {
    return <SubmitArtworkOverview />
  }
  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS initialRoute={{ component: Overview, passProps: { params: props } }} />
    </View>
  )
}
