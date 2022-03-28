import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Scenes/Consignments/Submission/uploadFileToS3"

export async function getConvertedImageUrlFromS3(imagePath: string) {
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"

  const assetCredentials = await getGeminiCredentialsForEnvironment({
    acl,
    name: convectionKey || "",
  })
  const bucket = assetCredentials.policyDocument.conditions.bucket
  const s3 = await uploadFileToS3({
    file: imagePath,
    acl,
    asset: assetCredentials,
  })
  return `https://${bucket}.s3.amazonaws.com/${s3.key}`
}
