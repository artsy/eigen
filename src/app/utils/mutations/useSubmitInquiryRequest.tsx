import { useSubmitInquiryRequestMutation } from "__generated__/useSubmitInquiryRequestMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useSubmitInquiryRequest = () => {
  return useMutation<useSubmitInquiryRequestMutation>(graphql`
    mutation useSubmitInquiryRequestMutation($input: SubmitInquiryRequestMutationInput!) {
      submitInquiryRequestMutation(input: $input) {
        clientMutationId
      }
    }
  `)
}
