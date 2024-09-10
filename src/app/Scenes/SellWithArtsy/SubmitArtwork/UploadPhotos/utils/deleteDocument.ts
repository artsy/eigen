import { removeAssetFromSubmission } from "app/Scenes/SellWithArtsy/mutations/removeAssetFromConsignmentSubmissionMutation"
import { NormalizedDocument } from "app/utils/normalizeUploadedDocument"

/**
 *
 * Remove a document from the submission
 *
 */
export const deleteDocument = async ({
  document,
  onComplete,
  onError,
}: {
  document: NormalizedDocument
  onComplete: () => void
  onError?: () => void
}) => {
  try {
    document.removed = true
    document.abortUploading?.()

    if (document.assetId) {
      await removeAssetFromSubmission({ assetID: document.assetId })
    }

    onComplete?.()
  } catch (error) {
    console.error("Failed to delete", error)
    onError?.()
  }
}
