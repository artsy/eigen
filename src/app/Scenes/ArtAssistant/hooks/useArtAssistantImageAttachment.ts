import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureException } from "@sentry/react-native"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtAssistantImage } from "app/Scenes/ArtAssistant/types"
import { prepareImageForUpload } from "app/Scenes/ArtAssistant/utils/prepareImageForUpload"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { useCallback, useRef, useState } from "react"
import { Alert, Linking } from "react-native"
import { PickerErrorCode } from "react-native-image-crop-picker"

export type ArtAssistantImageAttachment =
  | { status: "uploading"; uri: string }
  | { status: "ready"; uri: string; image: ArtAssistantImage }

export const ART_ASSISTANT_IMAGE_UPLOAD_ERROR = "Something went wrong. Please try another image."

export const useArtAssistantImageAttachment = () => {
  const toast = useToast()
  const { showActionSheetWithOptions } = useActionSheet()
  const [attachment, setAttachment] = useState<ArtAssistantImageAttachment | null>(null)
  // Bumped whenever the attachment is replaced or removed, so a slower upload that finishes
  // afterwards can tell it is stale and drop its result.
  const attempt = useRef(0)

  const remove = useCallback(() => {
    attempt.current += 1
    setAttachment(null)
  }, [])

  const pick = useCallback(async () => {
    let photoURI: string | undefined

    try {
      const [photo] = await showPhotoActionSheet(showActionSheetWithOptions, false, false)
      photoURI = photo?.path
    } catch (error) {
      const code = (error as { code?: PickerErrorCode } | undefined)?.code

      if (code === "E_PICKER_CANCELLED") {
        return
      }

      if (code === "E_NO_CAMERA_PERMISSION" || code === "E_NO_LIBRARY_PERMISSION") {
        showPermissionAlert(code === "E_NO_CAMERA_PERMISSION" ? "camera" : "photos")
        return
      }

      captureException(error, { tags: { source: "art_assistant_image_picker" } })
      toast.show(ART_ASSISTANT_IMAGE_UPLOAD_ERROR, "bottom", { backgroundColor: "red100" })
      return
    }

    if (!photoURI) {
      return
    }

    attempt.current += 1
    const currentAttempt = attempt.current

    setAttachment({ status: "uploading", uri: photoURI })

    try {
      const uri = await prepareImageForUpload(photoURI)
      const { bucket, key } = await uploadImageToS3(uri)

      if (currentAttempt !== attempt.current) {
        return
      }

      setAttachment({ status: "ready", uri, image: { s3Bucket: bucket, s3Key: key, uri } })
    } catch (error) {
      if (currentAttempt !== attempt.current) {
        return
      }

      captureException(error, { tags: { source: "art_assistant_image_upload" } })
      setAttachment(null)
      toast.show(ART_ASSISTANT_IMAGE_UPLOAD_ERROR, "bottom", { backgroundColor: "red100" })
    }
  }, [showActionSheetWithOptions, toast])

  return { attachment, pick, remove }
}

const showPermissionAlert = (source: "camera" | "photos") =>
  Alert.alert(
    `Allow access to your ${source}`,
    `To search with an image, allow Artsy to access your ${source} in Settings.`,
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]
  )
