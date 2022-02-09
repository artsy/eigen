import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { useFormikContext } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { Button, Flex, Spacer, Text } from "palette"
import React, { useEffect } from "react"
import { removeAssetFromSubmission } from "../Mutations/removeAssetFromConsignmentSubmissionMutation"
import { addPhotoToConsignment } from "./addPhotoToConsignment"
import {
  PhotoThumbnailErrorState,
  PhotoThumbnailLoadingState,
  PhotoThumbnailSuccessState,
} from "./PhotoThumbnail"
import { calculatePhotoSize } from "./utils/calculatePhotoSize"
import { Photo, PhotosFormModel } from "./validation"

export const UploadPhotosForm: React.FC<{ setPhotoUploadError: (arg: boolean) => void }> = ({
  setPhotoUploadError,
}) => {
  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()

  // pre-populate Formik values with photos from GlobalStore
  useEffect(() => {
    //  TODO
    if (submission.photos.photos.length) {
      setFieldValue("photos", [...values.photos, ...submission.photos.photos])
    }
  }, [])

  // add selected photos to gemini and submission; set them to GlobalStore and Formik values
  const addPhotoToSubmission = async (photos: Photo[]) => {
    for (const photo of photos) {
      photo.loading = true
      setFieldValue("photos", [...values.photos, photo])

      try {
        const uploadedPhoto = await addPhotoToConsignment(photo, submission.submissionId)
        if (uploadedPhoto?.id) {
          const sizedPhoto = calculatePhotoSize(photo)
          GlobalStore.actions.artworkSubmission.submission.setPhotos({
            photos: [...submission.photos.photos, sizedPhoto],
          })
          setFieldValue("photos", [...values.photos, sizedPhoto])
        }
      } catch (error) {
        photo.error = true
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

  // remove photo from submission, GlobalStore and Formik values
  const handlePhotoDelete = async (photo: Photo) => {
    const filteredPhotos = values.photos.filter((p: Photo) => p.id !== photo.id)
    try {
      await removeAssetFromSubmission({ assetID: photo.id })
      GlobalStore.actions.artworkSubmission.submission.setPhotos({
        photos: filteredPhotos,
      })
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

      {/* render different photo thumbnails depending on loading and error states */}
      {values.photos.map((photo: Photo, idx: number) => {
        if (photo?.loading) {
          return <PhotoThumbnailLoadingState key={idx} />
        } else if (photo?.error) {
          return (
            <PhotoThumbnailErrorState
              key={idx}
              photo={photo}
              handlePhotoDelete={handlePhotoDelete}
            />
          )
        }

        return (
          <PhotoThumbnailSuccessState
            key={idx}
            photo={photo}
            handlePhotoDelete={handlePhotoDelete}
          />
        )
      })}
    </>
  )
}
