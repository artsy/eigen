import { useFeatureFlag } from "app/store/GlobalStore"
import { GlobalStore } from "app/store/GlobalStore"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React, { useEffect } from "react"
import { View } from "react-native"
import { Overview } from "../Screens/Overview"
import { SubmitArtworkOverview } from "../Screens/SubmitArtworkOverview/SubmitArtworkOverview"

export interface ConsignmentsSubmissionUtmParams {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionUtmParams> = (props) => {
  const enableNewSWAFlow = useFeatureFlag("AREnableAccordionNavigationOnSubmitArtwork")

  useEffect(() => {
    GlobalStore.actions.artworkSubmission.submission.setUtmParams({
      utm_term: props.utm_term || "",
      utm_medium: props.utm_medium || "",
      utm_source: props.utm_source || "",
    })
  }, [])

  if (enableNewSWAFlow) {
    return <SubmitArtworkOverview />
  }
  return (
    <View style={{ flex: 1 }}>
      <NavigatorIOS
        initialRoute={{
          component: Overview,
          passProps: {
            params: props,
          },
        }}
      />
    </View>
  )
}
