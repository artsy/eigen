import { SubmitInquiryRequestMutation } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { commitMutation, Environment, graphql } from "relay-runtime"

export const SubmitInquiryRequest = (environment: Environment, inquireable: any, payload: any) => {
  return commitMutation<SubmitInquiryRequestMutation>(environment, {
    onError: (err) => {
      console.log("There was an error: " + err)
      // Show error state
    },
    onCompleted: (response) => {
      console.log("Inquiry Submitted: " + response)
      // Show delayed comfirmation notification
    },
    variables: {
      input: {
        inquireableID: inquireable.internalID,
        inquireableType: "Artwork",
        message: payload.message,
        questions: payload.inquiryQuestions,
      },
    },
    mutation: graphql`
      mutation SubmitInquiryRequestMutation($input: SubmitInquiryRequestMutationInput!) {
        submitInquiryRequestMutation(input: $input) {
          inquiryRequest {
            inquireable {
              __typename
              ... on Artwork {
                title
                artists {
                  name
                  birthday
                }
              }
            }
          }
        }
      }
    `,
  })
}
