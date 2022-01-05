import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "lib/Scenes/Consignments/Submission/geminiUploadToS3"

export async function getConvertedImageUrlFromS3(imagePath: string) {
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"

  if (!convectionKey) {
    console.error("Couldn't get convection key")
    return
  }

  const assetCredentials = await getGeminiCredentialsForEnvironment({ acl, name: convectionKey })
  const bucket = assetCredentials.policyDocument.conditions.bucket
  const s3 = await uploadFileToS3(imagePath, acl, assetCredentials)
  return `https://${bucket}.s3.amazonaws.com/${s3.key}`
}
