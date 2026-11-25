import { useCancelResaleSubmissionMutation } from "__generated__/useCancelResaleSubmissionMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useCancelResaleSubmission = () => {
  const { submitMutation } = useMutation<useCancelResaleSubmissionMutation>({
    mutation: graphql`
      mutation useCancelResaleSubmissionMutation($input: CancelResaleSubmissionInput!) {
        cancelResaleSubmission(input: $input) {
          resaleSubmissionOrError {
            __typename
            ... on CancelResaleSubmissionSuccess {
              resaleSubmission {
                internalID
                state
              }
            }
            ... on CancelResaleSubmissionFailure {
              mutationError {
                message
              }
            }
          }
        }
      }
    `,
  })

  return (id: string) =>
    submitMutation({
      variables: { input: { id } },
      rejectIf: (response) =>
        response.cancelResaleSubmission?.resaleSubmissionOrError?.__typename !==
        "CancelResaleSubmissionSuccess",
    })
}
