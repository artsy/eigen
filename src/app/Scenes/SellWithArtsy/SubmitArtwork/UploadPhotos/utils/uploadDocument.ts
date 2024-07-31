import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadFileToS3"
import { NormalizedDocument } from "app/utils/normalizeUploadedDocument"
import { isDocument } from "app/utils/showDocumentsAndPhotosActionSheet"

// **
// This function is used to upload documents to S3 **regardless of their type**
// It is used in the following scenarios:
// - When the user selects a document from the document picker
// - When the user selects a document/photo from the photos gallery
// **
export const uploadDocument = async ({
  document,
  updateProgress,
  acl = "private",
}: {
  document: NormalizedDocument
  updateProgress?: (progress: number) => void
  acl?: string
}) => {
  if (!document.item) {
    throw new Error("No document provided")
  }

  try {
    const convectionKey = await getConvectionGeminiKey()

    if (!convectionKey) return

    // Get S3 Credentials from Gemini
    const assetCredentials = await getGeminiCredentialsForEnvironment({
      acl: acl,
      name: convectionKey,
    })

    // Upload file to S3
    const res = await uploadFileToS3({
      filePath: isDocument(document.item) ? document.item.uri : document.item.path,
      acl,
      assetCredentials,
      updateProgress,
      file: document,
    })

    return { ...res, bucket: assetCredentials.policyDocument.conditions.bucket }
  } catch (error) {
    console.error(error)
  }
}
