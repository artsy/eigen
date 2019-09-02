import { metaphysics } from "../../../metaphysics"
import {
  createGeminiAssetWithS3Credentials,
  getConvectionGeminiKey,
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

export interface GeminiTokenResonse {
  data: {
    services: {
      convection: {
        geminiTemplateKey: string
      }
    }
  }
}

export const uploadImageAndPassToGemini = async (file: string, acl: string, submissionID: string) => {
  const convectionKey = await getConvectionGeminiKey()

  // Get S3 Credentials from Gemini
  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })

  // Upload our file to the place Gemini recommended
  const s3 = await uploadFileToS3(file, acl, assetCredentials)

  // Let Gemini know that this file exists and should be processed
  const geminiAssetToken = await createGeminiAssetWithS3Credentials({
    sourceKey: s3.key,
    templateKey: convectionKey,
    sourceBucket: assetCredentials.policyDocument.conditions.bucket,
    metadata: {
      id: submissionID,
      _type: "Consignment",
    },
  })

  // Let Convection know that the Gemini asset should be attached to the consignment
  await addAssetToConsignment({
    asset_type: "image",
    gemini_token: geminiAssetToken,
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
