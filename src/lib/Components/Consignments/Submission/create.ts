import { metaphysics } from "../../../metaphysics"
import { ConsignmentSetup } from "../index"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"
import { CreateSubmissionResponse } from "./types"

/**
 *
 * @param submission A submission object
 * @param id This ID isn't used, but is added to force a non-null ID in the submission
 */
export const createADraftSubmission = async (submission: ConsignmentSetup) => {
  const input = consignmentSetupToMutationInput(submission)
  const query = `mutation {
    createConsignmentSubmission(input:${input}) {
      consignment_submission {
        internalID
      }
    }
  }`

  const results = await metaphysics<CreateSubmissionResponse>({ query })
  return results.data.createConsignmentSubmission.consignment_submission
}

export default createADraftSubmission
