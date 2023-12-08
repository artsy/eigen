import { captureMessage } from "@sentry/react-native"
import {
  CommerceCreatePartnerOfferOrderInput,
  usePartnerOfferCheckoutMutation,
  usePartnerOfferCheckoutMutation$data,
} from "__generated__/usePartnerOfferCheckoutMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const usePartnerOfferMutation = (
  onMutationComplete?: (response: usePartnerOfferCheckoutMutation$data) => void
) => {
  const [commit] = useMutation<usePartnerOfferCheckoutMutation>(PartnerOfferCheckoutMutation)

  const commitMutation = (input: CommerceCreatePartnerOfferOrderInput) => {
    commit({
      variables: { input },
      onCompleted(response) {
        onMutationComplete?.(response)
      },
      onError(err) {
        if (__DEV__) {
          console.error(err)
        } else {
          captureMessage(`usePartnerOfferMutation: ${JSON.stringify(err)}`)
        }
      },
    })
  }

  return { commitMutation }
}

const PartnerOfferCheckoutMutation = graphql`
  mutation usePartnerOfferCheckoutMutation($input: CommerceCreatePartnerOfferOrderInput!) {
    commerceCreatePartnerOfferOrder(input: $input) {
      orderOrError {
        ... on CommerceOrderWithMutationSuccess {
          __typename
          order {
            internalID
            mode
          }
        }
        ... on CommerceOrderWithMutationFailure {
          error {
            type
            code
            data
          }
        }
      }
    }
  }
`
