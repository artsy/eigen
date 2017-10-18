// import { FormData } from "react-native"
// import { fetch } from "react-native"
import queryString from "query-string"
import { graphql } from "react-relay"
import { metaphysics } from "../../../metaphysics"
import objectToGraphQL from "./objectToGraphQL"

interface GeminiCredsInput {
  name: string
  acl: string
  clientMutationId?: string
}

interface GeminiCredsResponse {
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

interface GeminiEntryCreationInput {
  source_key: string
  template_key: string
  source_bucket: string
  metadata: any
  clientMutationId?: string
}

interface GeminiEntryCreationResonse {
  asset: {
    token: string
  }
}

export const uploadImageAndPassToGemini = async (file: string, acl: string) => {
  console.log(file)
  const creationInput = {
    name: "convection-staging",
    acl,
  }
  const geminiResponse = await getGeminiCredentialsForEnvironment(creationInput)
  console.log("creds: ", geminiResponse)

  const s3 = await uploadFileToS3(file, creationInput, geminiResponse)
  console.log("s3: ", s3)

  const triggerGeminiInput = {
    source_key: "",
    template_key: "convection-staging",
    source_bucket: geminiResponse.data.requestCredentialsForAssetUpload.asset.policy_document.conditions.bucket,
    metadata: {
      id: 169,
      _type: "Consignment",
    },
  }

  debugger
  // const geminiProcess = await createGeminiAssetWithS3Credentials()
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

// This is in RN, but not declared in the RN types
// https://github.com/facebook/react-native/blob/master/Libraries/Network/FormData.js
declare var FormData: any
declare var XMLHttpRequest: any

export const uploadFileToS3 = async (file: string, req: GeminiCredsInput, res: GeminiCredsResponse) => {
  return new Promise(resolve => {
    const asset = res.data.requestCredentialsForAssetUpload.asset

    const formData = new FormData()
    const geminiKey = asset.policy_document.conditions.gemini_key
    const bucket = asset.policy_document.conditions.bucket
    const uploadURL = `https://${bucket}.s3.amazonaws.com`
    const filename = file.split(/\//g).pop()

    const data = {
      "Content-Type": "image/jpg",
      key: geminiKey + "/${filename}",
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
    })

    const request = new XMLHttpRequest()
    request.onload = e => {
      console.log("Done")
      console.log(e)
      if (e.target.status === 204) {
        // Result in e.target.responseHeaders.Location
        console.log(e.target.responseHeaders.Location)
      }
      resolve(e)
    }
    request.open("POST", uploadURL, true)
    request.setRequestHeader("Content-type", "multipart/form-data")
    request.send(formData)
  })
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
    }  `
  return metaphysics<GeminiEntryCreationResonse>({ query, variables: {} })
}
