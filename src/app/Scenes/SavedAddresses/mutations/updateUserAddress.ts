import { UserAddressAttributes } from "__generated__/addNewAddressMutation.graphql"
import { updateUserAddressMutation } from "__generated__/updateUserAddressMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateUserAddress = (userAddressID: string, address: UserAddressAttributes) => {
  return new Promise<updateUserAddressMutation["response"]>((resolve, reject) => {
    commitMutation<updateUserAddressMutation>(defaultEnvironment, {
      variables: {
        input: {
          userAddressID,
          attributes: address,
        },
      },
      mutation: graphql`
        mutation updateUserAddressMutation($input: UpdateUserAddressInput!) {
          updateUserAddress(input: $input) {
            userAddressOrErrors {
              ... on UserAddress {
                id
                internalID
                name
                addressLine1
                addressLine2
                isDefault
                phoneNumber
                city
                region
                postalCode
                country
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
      onCompleted: (response, err) => {
        if (err?.length) {
          reject(err)
        } else if (response.updateUserAddress?.userAddressOrErrors.errors) {
          reject(response.updateUserAddress.userAddressOrErrors.errors)
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
