import { GlobalStore } from "lib/store/GlobalStore"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React, { useEffect } from "react"
import { View } from "react-native"
import { ConnectedOverview as Overview } from "../Screens/Overview"

interface ConsignmentsSubmissionFormProps {
  utm_campaign?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionFormProps> = (props) => {
  const { setCampaign } = GlobalStore.actions.consignments

  useEffect(() => {
    if (props.utm_campaign && props.utm_medium && props.utm_source) {
      setCampaign({ utm_campaign: props.utm_campaign, utm_medium: props.utm_medium, utm_source: props.utm_source })
    }
  }, [props.utm_campaign, props.utm_medium, props.utm_source])

  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS initialRoute={{ component: Overview }} />
    </View>
  )
}
