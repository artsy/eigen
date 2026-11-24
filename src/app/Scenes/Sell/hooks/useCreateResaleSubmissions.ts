import { useCreateResaleSubmissionsMutation } from "__generated__/useCreateResaleSubmissionsMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useCreateResaleSubmissions = () => {
  return useMutation<useCreateResaleSubmissionsMutation>({
    mutation: graphql`
      mutation useCreateResaleSubmissionsMutation($input: CreateResaleSubmissionsInput!) {
        createResaleSubmissions(input: $input) {
          resaleSubmissionsOrErrors {
            __typename
            ... on CreateResaleSubmissionSuccess {
              artworkID
              resaleSubmission {
                ...resaleSubmission_resaleSubmission
              }
            }
            ... on CreateResaleSubmissionFailure {
              artworkID
            }
          }
        }
      }
    `,
  })
}
