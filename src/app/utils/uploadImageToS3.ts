import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Components/PhotoRow/utils/uploadFileToS3"

export interface S3ImageUpload {
  key: string
  bucket: string
}

/**
 * Uploads a local image (e.g. a photo taken with the camera or picked from the gallery)
 * to S3 via Gemini credentials and returns the resulting S3 `key` and `bucket`.
 *
 * This mirrors `getConvertedImageUrlFromS3`, but returns the raw key/bucket instead of a
 * public URL — useful when the consumer needs to reference the object directly (e.g. an
 * image-search mutation that takes `{ bucket, key }`).
 */
export async function uploadImageToS3(imagePath: string): Promise<S3ImageUpload> {
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"

  const assetCredentials = await getGeminiCredentialsForEnvironment({
    acl,
    name: convectionKey || "",
  })

  const bucket = assetCredentials.policyDocument.conditions.bucket

  // Derive a filename from the local path so the S3 key ends in a real name
  // (e.g. `<geminiKey>+/photo.jpg`) instead of `<geminiKey>+/undefined`.
  const filename = imagePath.split("/").pop() || "photo.jpg"

  const { key } = await uploadFileToS3({
    filePath: imagePath,
    acl,
    assetCredentials,
    filename,
  })

  return { key, bucket }
}
