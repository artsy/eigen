import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { useFormikContext } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { removeAssetFromSubmission } from "../Mutations/removeAssetFromConsignmentSubmissionMutation"
import { addPhotoToConsignment } from "./addPhotoToConsignment"
import { PhotoRow } from "./PhotoRow"
import { calculatePhotoSize } from "./utils/calculatePhotoSize"
import { Photo, PhotosFormModel } from "./validation"

export const UploadPhotosForm: React.FC<{ setPhotoUploadError: (arg: boolean) => void }> = ({
  setPhotoUploadError,
}) => {
  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()

  // add selected photos to gemini and submission; set them to GlobalStore and Formik values
  const addPhotoToSubmission = async (photos: Photo[]) => {
    for (const photo of photos) {
      photo.loading = true
      setFieldValue("photos", [...values.photos, photo])

      try {
        const uploadedPhoto = await addPhotoToConsignment(photo, submission.submissionId)
        if (uploadedPhoto?.id) {
          const sizedPhoto = calculatePhotoSize(uploadedPhoto)
          setFieldValue("photos", [...values.photos, sizedPhoto])
        }
      } catch (error) {
        photo.error = true
        photo.errorMsg = "Photo could not be uploaded"
        captureMessage(JSON.stringify(error))
      } finally {
        photo.loading = false
      }
    }
  }

  // show Native action sheet and get photos from user's phone
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

  // remove photo from submission and Formik values
  const handlePhotoDelete = async (photo: Photo) => {
    try {
      await removeAssetFromSubmission({ assetID: photo.id })
      const filteredPhotos = values.photos.filter((p: Photo) => p.id !== photo.id)

      setFieldValue("photos", filteredPhotos)
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setPhotoUploadError(true)
    }
  }

  return (
    <>
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

      {values.photos.map((photo: Photo, idx: number) => (
        <PhotoRow key={idx} photo={photo} handlePhotoDelete={handlePhotoDelete} />
      ))}
    </>
  )
}
