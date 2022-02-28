import { deleteSavedAddressDeleteUserAddressMutation } from "__generated__/deleteSavedAddressDeleteUserAddressMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const deleteSavedAddress = (
  userAddressID: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  commitMutation<deleteSavedAddressDeleteUserAddressMutation>(defaultEnvironment, {
    variables: {
      input: {
        userAddressID,
      },
    },
    mutation: graphql`
      mutation deleteSavedAddressDeleteUserAddressMutation($input: DeleteUserAddressInput!) {
        deleteUserAddress(input: $input) {
          userAddressOrErrors {
            ... on UserAddress {
              id
              internalID
              name
              addressLine1
              addressLine2
              addressLine3
              city
              region
              postalCode
              phoneNumber
              isDefault
            }
            ... on Errors {
              errors {
                code
                message
              }
            }
          }
        }
      }
    `,
    onError: (e) => {
      onError(e.message)
    },
    onCompleted: (data) => {
      const errors = data?.deleteUserAddress?.userAddressOrErrors.errors
      if (errors) {
        onError(errors.map((error) => error.message).join(", "))
      } else {
        onSuccess()
      }
    },
  })
}
