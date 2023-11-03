import {
  RemoveAssetFromConsignmentSubmissionInput,
  removeAssetFromConsignmentSubmissionMutation,
} from "__generated__/removeAssetFromConsignmentSubmissionMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const removeAssetFromSubmission = (input: RemoveAssetFromConsignmentSubmissionInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<removeAssetFromConsignmentSubmissionMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation removeAssetFromConsignmentSubmissionMutation(
          $input: RemoveAssetFromConsignmentSubmissionInput!
        ) {
          removeAssetFromConsignmentSubmission(input: $input) {
            asset {
              id
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

        resolve(res.removeAssetFromConsignmentSubmission!.asset!.id!)
      },
    })
  })
}
