import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useFormikContext } from "formik"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { removeAssetFromSubmission } from "../Mutations/removeAssetFromConsignmentSubmissionMutation"
import { PhotoRow } from "./PhotoRow"
import { addPhotoToConsignment } from "./utils/addPhotoToConsignment"
import { calculateSinglePhotoSize } from "./utils/calculatePhotoSize"
import { isSizeLimitExceeded } from "./utils/calculatePhotoSize"
import { Photo, PhotosFormModel } from "./validation"

export const UploadPhotosForm: React.FC<{ isAnyPhotoLoading?: boolean }> = ({
  isAnyPhotoLoading,
}) => {
  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()

  // add selected photos to gemini and submission
  const addPhotoToSubmission = async (photos: Photo[]) => {
    const processedPhotos: Photo[] = []

    // set each to-be-uploaded photo's loading status
    photos.forEach((p: Photo) => (p.loading = true))
    setFieldValue("photos", [...values.photos, ...photos])

    for (const photo of photos) {
      try {
        // upload & size the photo, and add it to processed photos
        const uploadedPhoto = await addPhotoToConsignment(photo, submission.submissionId)
        if (uploadedPhoto?.id) {
          const sizedPhoto = calculateSinglePhotoSize(uploadedPhoto)
          const isTotalSizeLimitExceeded = isSizeLimitExceeded([
            ...values.photos,
            ...processedPhotos,
            sizedPhoto,
          ])
          // when total size limit exceeded, set photo's err state and stop the upload loop
          if (isTotalSizeLimitExceeded) {
            sizedPhoto.error = true
            sizedPhoto.errorMessage =
              "File exceeds the total size limit. Please delete photos or upload smaller file sizes."
            processedPhotos.push(sizedPhoto)
            break
          }
          processedPhotos.push(sizedPhoto)
        }
      } catch (error) {
        // set photo's error state and set it to processed photos
        photo.error = true
        photo.errorMessage = "Photo could not be uploaded"
        processedPhotos.push(photo)
        captureMessage(JSON.stringify(error))
      } finally {
        photo.loading = false
      }
    }

    // let GlobalStore and Formik know about processed photos
    GlobalStore.actions.artworkSubmission.submission.setPhotos({
      photos: [...values.photos, ...processedPhotos],
    })
    setFieldValue("photos", [...values.photos, ...processedPhotos])
  }

  // show Native action sheet and get photos from user's phone
  const handleAddPhotoPress = async () => {
    const photos = await showPhotoActionSheet(showActionSheetWithOptions, true)
    if (photos?.length && submission?.submissionId) {
      addPhotoToSubmission(photos)
    }
  }

  // remove photo from submission and Formik values
  const handlePhotoDelete = async (photo: Photo) => {
    try {
      await removeAssetFromSubmission({ assetID: photo.id })
      const filteredPhotos = values.photos.filter((p: Photo) => p.id !== photo.id)
      const isTotalSizeLimitExceeded = isSizeLimitExceeded(filteredPhotos)
      // make sure to clean error state from photos, if total size limit is not exceed after deletion
      if (!isTotalSizeLimitExceeded) {
        filteredPhotos.forEach((p: Photo) => {
          p.error = false
          p.errorMessage = ""
        })
      }
      setFieldValue("photos", filteredPhotos)
      GlobalStore.actions.artworkSubmission.submission.setPhotos({
        photos: [...filteredPhotos],
      })
    } catch (error) {
      photo.error = true
      photo.errorMessage = "Photo could not be deleted"
      captureMessage(JSON.stringify(error))
    }
  }

  return (
    <>
      <Flex style={{ borderColor: "lightgray", borderWidth: 1 }} mt={4} mb={2} p={2} pt={3} pb={3}>
        <Text variant="lg" color="black100" marginBottom={1}>
          Add Files Here
        </Text>
        <Text variant="md" color="black60" marginBottom={1}>
          Files Supported: JPG, PNG, HEIC
        </Text>
        <Text variant="md" color="black60" marginBottom={3}>
          Total Maximum Size: 30MB
        </Text>
        <Button
          disabled={isAnyPhotoLoading || isSizeLimitExceeded(values.photos)}
          onPress={handleAddPhotoPress}
          variant="outline"
          size="large"
          block
          testID="Submission_Add_Photos_Button"
        >
          Add Photo
        </Button>
        <Spacer mt={1} />
      </Flex>

      {values.photos.map((photo: Photo, idx: number) => (
        <PhotoRow key={idx} photo={photo} onPhotoDelete={handlePhotoDelete} />
      ))}
    </>
  )
}
