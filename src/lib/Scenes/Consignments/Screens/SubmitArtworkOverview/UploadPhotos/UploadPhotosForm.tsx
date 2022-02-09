import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { useFormikContext } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { uploadImageAndPassToGemini } from "../../../Submission/uploadPhotoToGemini"
import { Photo, PhotosFormModel } from "./validation"

export const UploadPhotosForm: React.FC<{ setPhotoUploadError: (arg: boolean) => void }> = ({
  setPhotoUploadError,
}) => {
  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()

  const addPhotoToSubmission = async (photos: Photo[]) => {
    for (const photo of photos) {
      photo.loading = true
      setFieldValue("photos", [...values.photos, photo])

      if (photo.path) {
        try {
          await uploadImageAndPassToGemini(photo.path, "private", submission.submissionId)
          GlobalStore.actions.artworkSubmission.submission.setPhotos({
            photos: [...submission.photos.photos, photo],
          })

          photo.loading = false
          setFieldValue("photos", [...values.photos, photo])
        } catch (error) {
          photo.loading = false
          photo.error = true
          captureMessage(JSON.stringify(error))
        }
      }
    }
  }

  const handleAddPhotoPress = async () => {
    try {
      const photos = await showPhotoActionSheet(showActionSheetWithOptions, true)
      if (photos?.length && submission?.submissionId) {
        addPhotoToSubmission(photos)
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setPhotoUploadError(true)
    }
  }

  return (
    <Flex style={{ borderColor: "lightgray", borderWidth: 1 }} mt={4} mb={2} p={2} pt={3} pb={3}>
      <Text variant="lg" color="black100" marginBottom={1}>
        Add Files Here
      </Text>
      <Text variant="md" color="black60" marginBottom={1}>
        Files Supported: JPG, PNG
      </Text>
      <Text variant="md" color="black60" marginBottom={3}>
        Total Maximum Size: 30MB
      </Text>
      <Button onPress={handleAddPhotoPress} variant="outline" size="large" block>
        Add Photo
      </Button>
      <Spacer mt={1} />
    </Flex>
  )
}
