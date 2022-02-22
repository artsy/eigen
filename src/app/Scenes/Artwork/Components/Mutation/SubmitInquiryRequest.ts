import { SubmitInquiryRequestMutation } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { InquiryQuestionInput } from "__generated__/SubmitInquiryRequestMutation.graphql"
import { ArtworkInquiryContextState } from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { commitMutation, Environment, graphql } from "relay-runtime"

export const SubmitInquiryRequest = (
  environment: Environment,
  inquireable: any,
  inquiryState: ArtworkInquiryContextState,
  setMutationSuccessful: (arg0: boolean) => void,
  setMutationError: (arg0: boolean) => void,
  trackError: () => void
) => {
  const formattedQuestions = inquiryState.inquiryQuestions.map((q: InquiryQuestionInput) => {
    if (q.questionID === "shipping_quote" && inquiryState.shippingLocation) {
      const { city, coordinates, country, postalCode, state, stateCode } =
        inquiryState.shippingLocation
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
      trackError()
      setMutationError(true)
    },
    onCompleted: () => {
      setMutationSuccessful(true)
    },
    variables: {
      input: {
        inquireableID: inquireable.internalID,
        inquireableType: "Artwork",
        questions: formattedQuestions,
        message: inquiryState.message?.trim(),
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
