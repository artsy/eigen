import { metaphysics } from "../../../metaphysics"
import objectToGraphQL from "./objectToGraphQL"
import { GeminiEntryCreationResonse } from "./uploadPhotoToGemini"

export interface GeminiCredsInput {
  name: string
  acl: string
  clientMutationId?: string
}

export interface GeminiCredsResponse {
  data: {
    requestCredentialsForAssetUpload: {
      asset: {
        signature: string
        credentials: string
        policy_encoded: string
        policy_document: {
          expiration: string
          conditions: {
            acl: string
            bucket: string
            gemini_key: string
            success_action_status: string
          }
        }
      }
    }
  }
}

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

export const getGeminiCredentialsForEnvironment = async (options: GeminiCredsInput) => {
  options.clientMutationId = Math.random().toString(8)
  const input = objectToGraphQL(options, [])
  const query = `
    mutation {
      requestCredentialsForAssetUpload(input: ${input}) {
        asset {
          signature
          credentials
          policy_encoded
          policy_document {
            expiration
            conditions {
              acl
              bucket
              gemini_key
              success_action_status
            }
          }
        }
      }
    }`
  return metaphysics<GeminiCredsResponse>({ query, variables: {} })
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

export const uploadFileToS3 = async (file: string, req: GeminiCredsInput, res: GeminiCredsResponse) =>
  new Promise<S3UploadResponse>(resolve => {
    const asset = res.data.requestCredentialsForAssetUpload.asset

    const formData = new FormData()
    const geminiKey = asset.policy_document.conditions.gemini_key
    const bucket = asset.policy_document.conditions.bucket
    const uploadURL = `https://${bucket}.s3.amazonaws.com`

    const data = {
      "Content-Type": "image/jpg",
      key: geminiKey + "/${filename}", // NOTE: This form (which _looks_ like ES6 interpolation) is required by AWS
      AWSAccessKeyId: asset.credentials,
      acl: req.acl,
      success_action_status: asset.policy_document.conditions.success_action_status,
      policy: asset.policy_encoded,
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
      if (e.target.status.toString() === asset.policy_document.conditions.success_action_status) {
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
