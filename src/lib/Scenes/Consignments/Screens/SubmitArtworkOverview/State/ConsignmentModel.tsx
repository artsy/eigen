import { Action, action } from "easy-peasy"

export interface ConsignmentSubmissionModel {
  sessionState: {
    submissionId: string
  }
  setSubmissionId: Action<ConsignmentSubmissionModel, string>
  resetSessionState: Action<ConsignmentSubmissionModel>
}

export const ConsignmentSubmissionModel: ConsignmentSubmissionModel = {
  sessionState: {
    submissionId: "72421",
  },
  setSubmissionId: action((state, id) => {
    state.sessionState.submissionId = id
  }),
  resetSessionState: action((state) => {
    state.sessionState.submissionId = ""
  }),
}

export interface ConsignmentModel {
  submission: ConsignmentSubmissionModel
}

export const getConsignmentModel = (): ConsignmentModel => ({
  submission: ConsignmentSubmissionModel,
})
