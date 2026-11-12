import { useCreateUserAddressMutation } from "__generated__/useCreateUserAddressMutation.graphql"
import { useMutation } from "app/utils/useMutation"
import { graphql } from "react-relay"

export const useCreateUserAddress = () => {
  return useMutation<useCreateUserAddressMutation>({
    mutation: graphql`
      mutation useCreateUserAddressMutation($input: CreateUserAddressInput!) {
        createUserAddress(input: $input) {
          me {
            ...SellLocationFields_me
          }
          userAddressOrErrors {
            __typename
            ... on UserAddress {
              internalID
            }
            ... on Errors {
              errors {
                message
              }
            }
          }
        }
      }
    `,
  })
}
