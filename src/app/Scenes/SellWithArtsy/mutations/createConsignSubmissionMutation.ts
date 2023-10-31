import {
  createConsignSubmissionMutation,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createConsignSubmission = (input: CreateSubmissionMutationInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<createConsignSubmissionMutation>(getRelayEnvironment(), {
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
