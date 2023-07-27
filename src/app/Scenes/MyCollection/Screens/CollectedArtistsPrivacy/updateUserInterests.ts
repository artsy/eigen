import { UserInterestInput } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/UserInterestsStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export const updateUserInterests = async (input: UserInterestInput[]) => {
  return new Promise((resolve, reject) => {
    commitMutation(getRelayEnvironment(), {
      mutation: graphql`
        mutation updateUserInterestsMutation($input: UpdateUserInterestsMutationInput!) {
          updateUserInterests(input: $input) {
            me {
              userInterestsConnection(first: 10) {
                edges {
                  internalID
                  private
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          userInterests: input,
        },
      },
      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(errors)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
