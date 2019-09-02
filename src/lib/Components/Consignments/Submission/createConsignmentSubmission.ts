import {
  createConsignmentSubmissionMutation,
  createConsignmentSubmissionMutationResponse,
} from "__generated__/createConsignmentSubmissionMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"
import { ConsignmentSetup } from "../index"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"

/**
 * @param submission A submission object
 */
export const createConsignmentSubmission = (submission: ConsignmentSetup) => {
  const input = consignmentSetupToMutationInput(submission)
  return new Promise<createConsignmentSubmissionMutationResponse>((resolve, reject) => {
    commitMutation<createConsignmentSubmissionMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createConsignmentSubmissionMutation($input: CreateSubmissionMutationInput!) {
          createConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
            }
          }
        }
      `,
      variables: { input },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          resolve(response)
        }
      },
    })
  }).then(response => response.createConsignmentSubmission.consignmentSubmission)
}
