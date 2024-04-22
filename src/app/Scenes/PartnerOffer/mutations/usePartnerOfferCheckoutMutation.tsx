import { captureMessage } from "@sentry/react-native"
import {
  CommerceCreatePartnerOfferOrderInput,
  usePartnerOfferCheckoutMutation,
  usePartnerOfferCheckoutMutation$data,
} from "__generated__/usePartnerOfferCheckoutMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const usePartnerOfferMutation = () => {
  const [commit] = useMutation<usePartnerOfferCheckoutMutation>(PartnerOfferCheckoutMutation)

  const commitMutation = (input: CommerceCreatePartnerOfferOrderInput) => {
    return new Promise<usePartnerOfferCheckoutMutation$data>((resolve, reject) => {
      commit({
        variables: { input },
        onCompleted(response) {
          resolve(response)
        },
        onError(err) {
          if (__DEV__) {
            console.error(err)
          } else {
            captureMessage(`usePartnerOfferMutation: ${JSON.stringify(err)}`)
            reject(err)
          }
        },
      })
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
