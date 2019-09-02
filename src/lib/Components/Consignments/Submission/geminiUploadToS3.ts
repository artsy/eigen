import { metaphysics } from "../../../metaphysics"
import { AssetCredentials } from "./Gemini/getGeminiCredentialsForEnvironment"
import objectToGraphQL from "./objectToGraphQL"
import { GeminiEntryCreationResonse } from "./uploadPhotoToGemini"
export { getGeminiCredentialsForEnvironment } from "./Gemini/getGeminiCredentialsForEnvironment"

export interface GeminiEntryCreationInput {
  source_key: string
  template_key: string
  source_bucket: string
  metadata: any
  clientMutationId?: string
}

export interface S3UploadResponse {
  key: string
}

export const createGeminiAssetWithS3Credentials = async (options: GeminiEntryCreationInput) => {
  options.clientMutationId = Math.random().toString(8)

  const input = objectToGraphQL(options, [])
  const query = `
    mutation {
      createGeminiEntryForAsset(input: ${input}) {
        asset {
          token
        }
      }
    }`
  return metaphysics<GeminiEntryCreationResonse>({ query, variables: {} })
}

// These are in RN, but not declared in the RN types:
// https://github.com/facebook/react-native/blob/master/Libraries/Network/FormData.js
// https://github.com/facebook/react-native/blob/master/Libraries/Network/XMLHttpRequest.js
declare var FormData: any
declare var XMLHttpRequest: any

export const uploadFileToS3 = async (file: string, acl: string, asset: AssetCredentials) =>
  new Promise<S3UploadResponse>(resolve => {
    const formData = new FormData()
    const geminiKey = asset.policyDocument.conditions.geminiKey
    const bucket = asset.policyDocument.conditions.bucket
    const uploadURL = `https://${bucket}.s3.amazonaws.com`

    const data = {
      acl,
      "Content-Type": "image/jpg",
      key: geminiKey + "/${filename}", // NOTE: This form (which _looks_ like ES6 interpolation) is required by AWS
      AWSAccessKeyId: asset.credentials,
      success_action_status: asset.policyDocument.conditions.successActionStatus,
      policy: asset.policyEncoded,
      signature: asset.signature,
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key])
      }
    }

    formData.append("file", {
      uri: file,
      type: "image/jpeg",
      name: "photo.jpg",
    })

    // Fetch didn't seem to work, so I had to move to a lower
    // level abstraction. Note that this request will fail if you are using a debugger.
    //
    // Kinda sucks, but https://github.com/jhen0409/react-native-debugger/issues/38
    const request = new XMLHttpRequest()
    request.onload = e => {
      if (e.target.status.toString() === asset.policyDocument.conditions.successActionStatus) {
        // e.g. https://artsy-media-uploads.s3.amazonaws.com/A3tfuXp0t5OuUKv07XaBOw%2F%24%7Bfilename%7D
        const url = e.target.responseHeaders.Location
        resolve({
          key: url
            .split("/")
            .pop()
            .replace("%2F", "/"),
        })
      } else {
        throw new Error("S3 upload failed")
      }
    }

    request.open("POST", uploadURL, true)
    request.setRequestHeader("Content-type", "multipart/form-data")
    request.send(formData)
  })
