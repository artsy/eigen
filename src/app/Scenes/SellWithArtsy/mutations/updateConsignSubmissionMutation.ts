import {
  updateConsignSubmissionMutation,
  UpdateSubmissionMutationInput,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const updateConsignSubmission = (input: UpdateSubmissionMutationInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<updateConsignSubmissionMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation updateConsignSubmissionMutation($input: UpdateSubmissionMutationInput!) {
          updateConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
            }
          }
        }
      `,
      variables: {
        input,
      },
      onError: reject,
      onCompleted: async (res, errors) => {
        if (errors !== null) {
          reject(errors)
          return
        }

        resolve(res.updateConsignmentSubmission!.consignmentSubmission!.internalID!)
      },
    })
  })
}
