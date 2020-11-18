import { SubmitInquiryRequestMutation } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { ArtworkInquiryContextState } from "lib/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { commitMutation, Environment, graphql } from "relay-runtime"

export const SubmitInquiryRequest = (
  environment: Environment,
  inquireable: any,
  inquiryState: ArtworkInquiryContextState,
  showErrorMessage?: any
) => {
  const formattedQuestions = inquiryState.inquiryQuestions.map((q: InquiryQuestionInput) => {
    if (q.questionID === "shipping_quote" && inquiryState.shippingLocation) {
      const { city, coordinates, country, postalCode, state, stateCode } = inquiryState.shippingLocation
      const locationInput = {
        city,
        coordinates,
        country,
        postal_code: postalCode,
        state,
        state_code: stateCode,
      }
      const details = JSON.stringify(locationInput)
      return { ...q, details }
    } else {
      return q
    }
  })

  return commitMutation<SubmitInquiryRequestMutation>(environment, {
    onError: () => {
      // Show error state
      showErrorMessage(true)
    },
    onCompleted: () => {
      // Show delayed comfirmation notification
    },
    variables: {
      input: {
        inquireableID: inquireable.internalID,
        inquireableType: "Artwork",
        // message: inquiryState.message,
        questions: formattedQuestions,
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
