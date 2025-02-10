import { useCreateCreditCardMutation } from "__generated__/useCreateCreditCardMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useCreateCreditCard = () => {
  return useMutation<useCreateCreditCardMutation>(graphql`
    mutation useCreateCreditCardMutation($input: CreditCardInput!) {
      createCreditCard(input: $input) {
        creditCardOrError {
          ... on CreditCardMutationSuccess {
            creditCard {
              id
              brand
              lastDigits
              expirationYear
              expirationMonth
            }
          }
          ... on CreditCardMutationFailure {
            mutationError {
              type
              message
              detail
            }
          }
        }
      }
    }
  `)
}
