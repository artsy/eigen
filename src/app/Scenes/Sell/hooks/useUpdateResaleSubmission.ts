import { useUpdateResaleSubmissionMutation } from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useUpdateResaleSubmission = () => {
  return useMutation<useUpdateResaleSubmissionMutation>({
    mutation: graphql`
      mutation useUpdateResaleSubmissionMutation($input: UpdateResaleSubmissionInput!) {
        updateResaleSubmission(input: $input) {
          resaleSubmissionOrError {
            __typename
            ... on UpdateResaleSubmissionSuccess {
              resaleSubmission {
                ...resaleSubmission_resaleSubmission
              }
            }
            ... on UpdateResaleSubmissionFailure {
              mutationError {
                message
              }
            }
          }
        }
      }
    `,
  })
}
