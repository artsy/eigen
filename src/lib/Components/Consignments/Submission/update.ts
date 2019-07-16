import { metaphysics } from "../../../metaphysics"
import { ConsignmentSetup } from "../index"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"
import { UpdateSubmissionResponse } from "./types"

/**
 *
 * @param submission A submission object
 * @param id This ID isn't used, but is added to force a non-null ID in the submission
 */
const updateASubmission = async (submission: ConsignmentSetup, _internalID: string) => {
  const input = consignmentSetupToMutationInput(submission)
  const query = `mutation {
    updateConsignmentSubmission(input:${input}) {
      consignment_submission {
        internalID
      }
    }
  }`

  const results = await metaphysics<UpdateSubmissionResponse>({ query })
  return results.data.updateConsignmentSubmission.consignment_submission
}

export default updateASubmission
