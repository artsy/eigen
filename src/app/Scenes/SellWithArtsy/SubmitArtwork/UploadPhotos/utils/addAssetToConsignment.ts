import {
  addAssetToConsignmentMutation,
  AddAssetToConsignmentSubmissionInput,
} from "__generated__/addAssetToConsignmentMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const addAssetToConsignment = (input: AddAssetToConsignmentSubmissionInput) => {
  return new Promise<addAssetToConsignmentMutation["response"]>((resolve, reject) => {
    commitMutation<addAssetToConsignmentMutation>(getRelayEnvironment(), {
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
          clientMutationId: __TEST__ ? "random-client-mutation-id" : Math.random().toString(8),
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
