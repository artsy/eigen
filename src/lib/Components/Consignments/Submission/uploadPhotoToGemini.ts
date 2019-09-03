import { addAssetToConsignment } from "./addAssetToConsignment"
import {
  createGeminiAssetWithS3Credentials,
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "./geminiUploadToS3"

export const uploadImageAndPassToGemini = async (file: string, acl: string, submissionID: string) => {
  const convectionKey = await getConvectionGeminiKey()

  // Get S3 Credentials from Gemini
  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })

  // Upload our file to the place Gemini recommended
  const s3 = await uploadFileToS3(file, acl, assetCredentials)

  // Let Gemini know that this file exists and should be processed
  const geminiToken = await createGeminiAssetWithS3Credentials({
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
    assetType: "image",
    geminiToken,
    submissionID,
  })
}
