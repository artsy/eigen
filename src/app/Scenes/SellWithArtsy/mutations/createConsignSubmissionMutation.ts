import {
  createConsignSubmissionMutation,
  CreateSubmissionMutationInput,
} from "__generated__/createConsignSubmissionMutation.graphql"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createConsignSubmission = (input: CreateSubmissionMutationInput) => {
  return new Promise<{
    internalID: string
    externalID: string
  }>((resolve, reject) => {
    commitMutation<createConsignSubmissionMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation createConsignSubmissionMutation($input: CreateSubmissionMutationInput!) {
          createConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
              externalId
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

        if (
          res.createConsignmentSubmission?.consignmentSubmission?.externalId &&
          res.createConsignmentSubmission?.consignmentSubmission?.internalID
        ) {
          resolve({
            internalID: res.createConsignmentSubmission.consignmentSubmission.internalID,
            externalID: res.createConsignmentSubmission.consignmentSubmission.externalId,
          })
        }
      },
    })
  })
}
