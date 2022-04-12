import { GlobalStore } from "app/store/GlobalStore"
import React, { useEffect } from "react"
import { SubmitArtworkOverview } from "../Screens/SubmitArtworkOverview/SubmitArtworkOverview"

export interface ConsignmentsSubmissionUtmParams {
  utm_term?: string
  utm_medium?: string
  utm_source?: string
}

export const ConsignmentsSubmissionForm: React.FC<ConsignmentsSubmissionUtmParams> = (props) => {
  useEffect(() => {
    GlobalStore.actions.artworkSubmission.submission.setUtmParams({
      utm_term: props.utm_term || "",
      utm_medium: props.utm_medium || "",
      utm_source: props.utm_source || "",
    })
  }, [])

  return <SubmitArtworkOverview />
}
