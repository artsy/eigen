import { addAssetToConsignment } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/addAssetToConsignment"
import { uploadDocument } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadDocument"
import { NormalizedDocument } from "app/utils/normalizeUploadedDocument"

/**
 * Uploads a document to S3 and associates it to the consignment submission
 * 1. Upload the file to S3
 * 2. Associate the file to the consignment submission
 *
 */
export const addDocumentToSubmission = async ({
  document,
  externalId,
  submissionId,
  updateProgress,
  onError,
}: {
  document: NormalizedDocument
  externalId: string
  submissionId: string
  updateProgress?: (progress: number) => void
  onError?: () => void
}) => {
  try {
    if (document.errorMessage) {
      return
    }

    document.loading = true

    // Upload the document to S3
    const response = await uploadDocument({
      document,
      updateProgress,
    })

    if (!response?.key) {
      document.errorMessage = "Failed to upload file"
      return
    }

    document.sourceKey = response.key

    // Associate the document to the consignment submission
    // upload & size the photo, and add it to processed photos
    // let Convection know that the Gemini asset should be attached to the consignment
    const res = await addAssetToConsignment({
      assetType: "additional_file",
      source: {
        key: response.key,
        bucket: document.bucket || response.bucket,
      },
      filename: document.name,
      externalSubmissionId: externalId,
      size: document.size,
      submissionID: submissionId,
    })

    document.assetId = res.addAssetToConsignmentSubmission?.asset?.id
  } catch (error) {
    console.error("Error uploading file", error)
    onError?.()
  } finally {
    document.loading = false
  }
}
