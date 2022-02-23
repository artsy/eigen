import {
  RemoveAssetFromConsignmentSubmissionInput,
  removeAssetFromConsignmentSubmissionMutation,
} from "__generated__/removeAssetFromConsignmentSubmissionMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const removeAssetFromSubmission = (input: RemoveAssetFromConsignmentSubmissionInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<removeAssetFromConsignmentSubmissionMutation>(defaultEnvironment, {
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
