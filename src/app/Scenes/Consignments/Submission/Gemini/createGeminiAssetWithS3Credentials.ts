import {
  createGeminiAssetWithS3CredentialsMutation,
  CreateGeminiEntryForAssetInput,
} from "__generated__/createGeminiAssetWithS3CredentialsMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const createGeminiAssetWithS3Credentials = (input: CreateGeminiEntryForAssetInput) => {
  return new Promise<string>((resolve, reject) => {
    commitMutation<createGeminiAssetWithS3CredentialsMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createGeminiAssetWithS3CredentialsMutation(
          $input: CreateGeminiEntryForAssetInput!
        ) {
          createGeminiEntryForAsset(input: $input) {
            asset {
              token
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
          resolve(response.createGeminiEntryForAsset.asset.token)
        }
      },
    })
  })
}
