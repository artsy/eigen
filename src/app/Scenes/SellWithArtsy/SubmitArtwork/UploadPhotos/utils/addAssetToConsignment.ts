import {
  addAssetToConsignmentMutation,
  AddAssetToConsignmentSubmissionInput,
} from "__generated__/addAssetToConsignmentMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const addAssetToConsignment = (input: AddAssetToConsignmentSubmissionInput) => {
  return new Promise<addAssetToConsignmentMutation["response"]>((resolve, reject) => {
    commitMutation<addAssetToConsignmentMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation addAssetToConsignmentMutation($input: AddAssetToConsignmentSubmissionInput!) {
          addAssetToConsignmentSubmission(input: $input) {
            asset {
              id
              submissionID
            }
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: Math.random().toString(8),
        },
      },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          resolve(response)
        }
      },
    })
  })
}
