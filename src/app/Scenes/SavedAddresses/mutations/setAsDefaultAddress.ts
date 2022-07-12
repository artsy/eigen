import {
  setAsDefaultAddressMutation,
  UpdateUserDefaultAddressInput,
} from "__generated__/setAsDefaultAddressMutation.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const setAsDefaultAddress = (id: UpdateUserDefaultAddressInput["userAddressID"]) => {
  return new Promise<setAsDefaultAddressMutation["response"]>((resolve, reject) => {
    commitMutation<setAsDefaultAddressMutation>(getRelayEnvironment(), {
      variables: {
        input: {
          userAddressID: id,
        },
      },
      mutation: graphql`
        mutation setAsDefaultAddressMutation($input: UpdateUserDefaultAddressInput!) {
          updateUserDefaultAddress(input: $input) {
            userAddressOrErrors {
              ... on UserAddress {
                id
                internalID
                isDefault
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
      onCompleted: (response, err) => {
        if (err?.length) {
          reject(err)
        } else if (response.updateUserDefaultAddress?.userAddressOrErrors.errors) {
          reject(response.updateUserDefaultAddress.userAddressOrErrors.errors)
        } else {
          resolve(response)
        }
      },
      onError: (e) => {
        reject(e.message)
      },
    })
  })
}
