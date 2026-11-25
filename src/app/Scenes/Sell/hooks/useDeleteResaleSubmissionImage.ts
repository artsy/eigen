import { useDeleteResaleSubmissionImageMutation } from "__generated__/useDeleteResaleSubmissionImageMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useDeleteResaleSubmissionImage = () => {
  return useMutation<useDeleteResaleSubmissionImageMutation>({
    mutation: graphql`
      mutation useDeleteResaleSubmissionImageMutation($input: DeleteResaleSubmissionImageInput!) {
        deleteResaleSubmissionImage(input: $input) {
          resaleSubmissionOrError {
            __typename
            ... on DeleteResaleSubmissionImageSuccess {
              resaleSubmission {
                ...conditionPhotos_resaleSubmission
              }
            }
            ... on DeleteResaleSubmissionImageFailure {
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
