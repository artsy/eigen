import { Action, action } from "easy-peasy"
import { ConsignmentsSubmissionUtmParams } from "../../../ConsignmentsHome/ConsignmentsSubmissionForm"

export interface ConsignmentSubmissionModel {
  sessionState: {
    submissionId: string
  }
  utmParams: ConsignmentsSubmissionUtmParams
  setSubmissionId: Action<ConsignmentSubmissionModel, string>
  setUtmParams: Action<ConsignmentSubmissionModel, ConsignmentsSubmissionUtmParams>
  resetSessionState: Action<ConsignmentSubmissionModel>
}

export const ConsignmentSubmissionModel: ConsignmentSubmissionModel = {
  sessionState: {
    submissionId: "",
  },
  utmParams: {
    utm_term: "",
    utm_medium: "",
    utm_source: "",
  },
  setSubmissionId: action((state, id) => {
    state.sessionState.submissionId = id
  }),
  setUtmParams: action((state, params) => {
    state.utmParams = params
  }),
  resetSessionState: action((state) => {
    state.sessionState.submissionId = ""
    state.utmParams = {
      utm_term: "",
      utm_medium: "",
      utm_source: "",
    }
  }),
}

export interface ConsignmentModel {
  submission: ConsignmentSubmissionModel
}

export const getConsignmentSubmissionModel = (): ConsignmentModel => ({
  submission: ConsignmentSubmissionModel,
})
