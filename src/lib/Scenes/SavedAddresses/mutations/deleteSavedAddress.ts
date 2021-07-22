import {
  deleteSavedAddressDeleteUserAddressMutation,
  deleteSavedAddressDeleteUserAddressMutationResponse,
} from "__generated__/deleteSavedAddressDeleteUserAddressMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const deleteSavedAddress = (userAddressID: string) => {
  return new Promise<deleteSavedAddressDeleteUserAddressMutationResponse>((resolve, reject) => {
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
      onError: reject,
      onCompleted: (response) => {
        const errors = response.deleteUserAddress?.userAddressOrErrors?.errors
        if (errors?.length) {
          reject(errors.map((error) => error.message).join(", "))
        } else if (errors) {
          reject(errors)
        } else {
          resolve(response)
        }
      },
    })
  })
}
