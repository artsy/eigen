import { updateConsignmentSubmissionMutation } from "__generated__/updateConsignmentSubmissionMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"
import { ConsignmentSetup } from "./index"

export const updateConsignmentSubmission = (submission: ConsignmentSetup) => {
  const input = consignmentSetupToMutationInput(submission)
  return new Promise((resolve, reject) => {
    commitMutation<updateConsignmentSubmissionMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation updateConsignmentSubmissionMutation($input: UpdateSubmissionMutationInput!) {
          updateConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
            }
          }
        }
      `,
      variables: { input },
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
