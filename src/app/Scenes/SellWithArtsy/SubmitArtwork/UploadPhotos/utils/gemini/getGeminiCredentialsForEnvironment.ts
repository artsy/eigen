import {
  getGeminiCredentialsForEnvironmentMutation,
  RequestCredentialsForAssetUploadInput,
} from "__generated__/getGeminiCredentialsForEnvironmentMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export type AssetCredentials =
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  getGeminiCredentialsForEnvironmentMutation["response"]["requestCredentialsForAssetUpload"]["asset"]

export const getGeminiCredentialsForEnvironment = (
  input: RequestCredentialsForAssetUploadInput
) => {
  return new Promise<AssetCredentials>((resolve, reject) => {
    commitMutation<getGeminiCredentialsForEnvironmentMutation>(defaultEnvironment, {
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
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          resolve(response.requestCredentialsForAssetUpload.asset)
        }
      },
    })
  })
}
