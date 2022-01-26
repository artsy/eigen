import { useFeatureFlag } from "lib/store/GlobalStore"
import { GlobalStore } from "lib/store/GlobalStore"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React, { useEffect } from "react"
import { View } from "react-native"
import { ConnectedOverview as Overview } from "../Screens/Overview"
import { SubmitArtworkOverview } from "../Screens/SubmitArtworkOverview/SubmitArtworkOverview"

export interface ConsignmentsSubmissionUtmParams {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionUtmParams> = ({
  utm_term,
  utm_medium,
  utm_source,
}) => {
  const enableNewSWAFlow = useFeatureFlag("AREnableAccordionNavigationOnSubmitArtwork")

  useEffect(() => {
    if (utm_term || utm_medium || utm_source) {
      GlobalStore.actions.artworkSubmission.submission.setUtmParams({
        utm_term,
        utm_medium,
        utm_source,
      })
    }
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
            params: {
              utm_term,
              utm_medium,
              utm_source,
            },
          },
        }}
      />
    </View>
  )
}
