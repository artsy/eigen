import {
  updateConsignSubmissionMutation,
  UpdateSubmissionMutationInput,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateConsignSubmission = (input: UpdateSubmissionMutationInput) => {
  return new Promise<{
    internalID: string
    externalID: string
  }>((resolve, reject) => {
    commitMutation<updateConsignSubmissionMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation updateConsignSubmissionMutation($input: UpdateSubmissionMutationInput!) {
          updateConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
              externalId
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

        if (
          res.updateConsignmentSubmission?.consignmentSubmission?.externalId &&
          res.updateConsignmentSubmission?.consignmentSubmission?.internalID
        ) {
          resolve({
            internalID: res.updateConsignmentSubmission.consignmentSubmission.internalID,
            externalID: res.updateConsignmentSubmission.consignmentSubmission.externalId,
          })
        }
      },
    })
  })
}
