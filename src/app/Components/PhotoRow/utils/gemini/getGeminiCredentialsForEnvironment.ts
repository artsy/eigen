import {
  getGeminiCredentialsForEnvironmentMutation,
  RequestCredentialsForAssetUploadInput,
} from "__generated__/getGeminiCredentialsForEnvironmentMutation.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { commitMutation, graphql } from "react-relay"

export type AssetCredentials = NonNullable<
  NonNullable<
    getGeminiCredentialsForEnvironmentMutation["response"]["requestCredentialsForAssetUpload"]
  >["asset"]
>

export const getGeminiCredentialsForEnvironment = (
  input: RequestCredentialsForAssetUploadInput
) => {
  return new Promise<AssetCredentials>((resolve, reject) => {
    commitMutation<getGeminiCredentialsForEnvironmentMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation getGeminiCredentialsForEnvironmentMutation(
          $input: RequestCredentialsForAssetUploadInput!
        ) {
          requestCredentialsForAssetUpload(input: $input) {
            asset {
              signature
              credentials
              policyEncoded
              policyDocument {
                expiration
                conditions {
                  acl
                  bucket
                  geminiKey
                  successActionStatus
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: Math.random().toString(8),
        },
      },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          const asset = response.requestCredentialsForAssetUpload?.asset
          if (!asset) {
            reject(new Error("No asset credentials were returned"))
          } else {
            resolve(asset)
          }
        }
      },
    })
  })
}
