import queryString from "query-string"
import { metaphysics } from "../../../metaphysics"
import {
  createGeminiAssetWithS3Credentials,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "./geminiUploadToS3"
import objectToGraphQL from "./objectToGraphQL"

interface ConvectionAssetSubmissionInput {
  asset_type: string
  gemini_token: string
  submission_id: string
  clientMutationId?: string
}

export interface GeminiEntryCreationResonse {
  data: {
    createGeminiEntryForAsset: {
      asset: {
        token: string
      }
    }
  }
}

export const uploadImageAndPassToGemini = async (file: string, acl: string, submissionID: string) => {
  const creationInput = {
    name: "convection-staging",
    acl,
  }
  // Get S3 Credentials from Gemini
  const geminiResponse = await getGeminiCredentialsForEnvironment(creationInput)
  // Upload our file to the place Gemini recommended
  const s3 = await uploadFileToS3(file, creationInput, geminiResponse)

  const triggerGeminiInput = {
    source_key: s3.key,
    template_key: "convection-staging",
    source_bucket: geminiResponse.data.requestCredentialsForAssetUpload.asset.policy_document.conditions.bucket,
    metadata: {
      id: submissionID,
      _type: "Consignment",
    },
  }

  // Let Gemini know that this file exists and should be processed
  const geminiProcess = await createGeminiAssetWithS3Credentials(triggerGeminiInput)

  // Let Convection know that the Gemini asset should be attached to the consignment
  await addAssetToConsignment({
    asset_type: "image",
    gemini_token: geminiProcess.data.createGeminiEntryForAsset.asset.token,
    submission_id: submissionID,
  })
}

export const addAssetToConsignment = async (options: ConvectionAssetSubmissionInput) => {
  options.clientMutationId = Math.random().toString(8)

  const input = objectToGraphQL(options, [])
  const query = `
    mutation {
      addAssetToConsignmentSubmission(input: ${input}) {
        asset {
          submission_id
        }
      }
    }`
  return metaphysics<GeminiEntryCreationResonse>({ query, variables: {} })
}
