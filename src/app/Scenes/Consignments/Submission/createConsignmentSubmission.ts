import { createConsignmentSubmissionMutation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import { commitMutation, graphql } from "relay-runtime"
import { ConsignmentSetup } from "../index"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"

export const createConsignmentSubmission = (submission: ConsignmentSetup) => {
  const input = consignmentSetupToMutationInput(submission)
  return new Promise<string>((resolve, reject) => {
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
      variables: {
        input: {
          ...input,
          userAgent: getCurrentEmissionState().userAgent,
        },
      },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          resolve(response.createConsignmentSubmission.consignmentSubmission.internalID)
        }
      },
    })
  })
}
