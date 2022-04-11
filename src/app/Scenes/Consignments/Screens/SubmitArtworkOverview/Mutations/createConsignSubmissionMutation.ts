import {
  createConsignSubmissionMutation,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import { commitMutation, graphql } from "relay-runtime"

const DEFAULT_SOURCE = "APP_INBOUND"

export const createConsignSubmission = (input: CreateSubmissionMutationInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<createConsignSubmissionMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createConsignSubmissionMutation($input: CreateSubmissionMutationInput!) {
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
          source: input.source || DEFAULT_SOURCE,
          userAgent: getCurrentEmissionState().userAgent,
        },
      },
      onError: reject,
      onCompleted: async (res, errors) => {
        if (errors !== null) {
          reject(errors)
          return
        }

        resolve(res.createConsignmentSubmission!.consignmentSubmission!.internalID!)
      },
    })
  })
}
