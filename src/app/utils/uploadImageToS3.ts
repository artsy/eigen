import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Components/PhotoRow/utils/uploadFileToS3"

export interface S3ImageUpload {
  bucket: string
  key: string
}

/**
 * Uploads a local image (e.g. a photo taken with Lens's camera, or picked from the library) to S3
 * via Gemini/Convection credentials — the same credential flow MyCollection's photo upload uses —
 * and returns the resulting S3 `bucket`/`key`, ready to pass into `artworksByImageConnection`.
 */
export async function uploadImageToS3(imagePath: string): Promise<S3ImageUpload> {
  const convectionKey = await getConvectionGeminiKey()
  const acl = "private"

  const assetCredentials = await getGeminiCredentialsForEnvironment({
    acl,
    name: convectionKey || "",
  })

  const bucket = assetCredentials.policyDocument.conditions.bucket
  const filename = imagePath.split("/").pop() || "photo.jpg"

  const { key } = await uploadFileToS3({
    filePath: imagePath,
    acl,
    assetCredentials,
    filename,
  })

  return { bucket, key }
}
