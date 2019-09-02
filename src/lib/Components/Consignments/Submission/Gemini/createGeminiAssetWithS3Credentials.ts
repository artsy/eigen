import {
  createGeminiAssetWithS3CredentialsMutation,
  createGeminiAssetWithS3CredentialsMutationResponse,
  CreateGeminiEntryForAssetInput,
} from "__generated__/createGeminiAssetWithS3CredentialsMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

export const createGeminiAssetWithS3Credentials = (input: CreateGeminiEntryForAssetInput) => {
  return new Promise<createGeminiAssetWithS3CredentialsMutationResponse>((resolve, reject) => {
    commitMutation<createGeminiAssetWithS3CredentialsMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createGeminiAssetWithS3CredentialsMutation($input: CreateGeminiEntryForAssetInput!) {
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
        if (errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          resolve(response)
        }
      },
    })
  }).then(data => data.createGeminiEntryForAsset.asset.token)
}
