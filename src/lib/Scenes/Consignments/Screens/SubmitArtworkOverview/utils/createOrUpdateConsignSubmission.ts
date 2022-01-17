import { CreateSubmissionMutationInput } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { UpdateSubmissionMutationInput } from "__generated__/updateConsignSubmissionMutation.graphql"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"

export type SubmissionInput = CreateSubmissionMutationInput | UpdateSubmissionMutationInput

export const createOrUpdateConsignSubmission = async (submission: SubmissionInput) => {
  const input = submission as UpdateSubmissionMutationInput

  if (input.id) {
    return await updateConsignSubmission(input)
  }

  return await createConsignSubmission(submission as CreateSubmissionMutationInput)
}
