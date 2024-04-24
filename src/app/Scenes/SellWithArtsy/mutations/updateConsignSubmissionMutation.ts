import {
  updateConsignSubmissionMutation,
  UpdateSubmissionMutationInput,
} from "__generated__/updateConsignSubmissionMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { isEmpty, omitBy } from "lodash"
import { commitMutation, graphql } from "react-relay"

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
        input: omitBy(input, isEmpty),
      },
      onError: reject,
      onCompleted: async (res, errors) => {
        if (errors !== null) {
          reject(errors)
          return
        }

        if (res.updateConsignmentSubmission?.consignmentSubmission?.internalID) {
          resolve(res.updateConsignmentSubmission.consignmentSubmission.internalID)
        }
      },
    })
  })
}
