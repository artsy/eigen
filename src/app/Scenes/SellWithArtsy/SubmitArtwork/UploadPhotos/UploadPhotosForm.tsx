import { ActionType, OwnerType } from "@artsy/cohesion"
import { UploadSizeLimitExceeded } from "@artsy/cohesion/dist/Schema/Events/UploadSizeLimitExceeded"
import { AddIcon, Flex, ImageIcon, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { PhotoItem } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/UploadPhotosPhotoItem"
import {
  Photo,
  PhotosFormModel,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { removeAssetFromSubmission } from "app/Scenes/SellWithArtsy/mutations/removeAssetFromConsignmentSubmissionMutation"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import { addPhotoToConsignment } from "./utils/addPhotoToConsignment"
import {
  calculateSinglePhotoSize,
  getPhotosSize,
  isSizeLimitExceeded,
} from "./utils/calculatePhotoSize"

export const IMAGE_SIZE = 110
export const ICON_SIZE = 18

export const UploadPhotosForm: React.FC<{ isAnyPhotoLoading?: boolean }> = ({
  isAnyPhotoLoading,
}) => {
  const space = useSpace()
  const enableNewSubmissionFlow = useFeatureFlag("AREnableNewSubmissionFlow")

  const { values, setFieldValue } = useFormikContext<PhotosFormModel>()
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const submissionId = submission.submissionId || values.submissionId

  const { showActionSheetWithOptions } = useActionSheet()
  const [progress, setProgress] = useState<Record<string, number | undefined>>({})
  const { trackEvent } = useTracking()

  useEffect(() => {
    // To avoid adding duplicate photos when the component is remounted and the effect is called more than once.
    if (values.photos?.length) return

    // Adding initial photos when a My Collection artwork gets submitted
    addPhotosToSubmission(values.initialPhotos || [])
  }, [])

  // add selected photos to gemini and submission
  const addPhotosToSubmission = async (photos: Photo[]) => {
    if (!submissionId) {
      console.error("Submission ID not found")
      return null
    }

    const processedPhotos: Photo[] = []

    // set each to-be-uploaded photo's loading status
    photos.forEach((p: Photo) => (p.loading = true))
    // Animate the appearance of newly added photos
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setFieldValue("photos", [...values.photos, ...photos])

    await Promise.all(
      photos.map(async (photo) => {
        try {
          // upload & size the photo, and add it to processed photos
          const uploadedPhoto = await addPhotoToConsignment({
            asset: photo,
            submissionID: submissionId,
            updateProgress: (newProgress) => {
              setProgress((prevState) => {
                const newState = { ...prevState, [photo.path]: newProgress }
                return newState
              })
            },
          })
          if (uploadedPhoto?.id) {
            const sizedPhoto = calculateSinglePhotoSize(uploadedPhoto)

            const availablePhotos = [...values.photos, ...processedPhotos, sizedPhoto]
            const isTotalSizeLimitExceeded = isSizeLimitExceeded(availablePhotos)
            // when total size limit exceeded, set photo's err state and stop the upload loop
            if (isTotalSizeLimitExceeded) {
              sizedPhoto.error = true
              sizedPhoto.errorMessage =
                "File exceeds the total size limit. Please delete photos or upload smaller file sizes."
              processedPhotos.push(sizedPhoto)

              trackEvent(
                tracks.hasExceededUploadSize(getPhotosSize(availablePhotos), availablePhotos.length)
              )
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
      })
    )

    const allPhotos = [...values.photos, ...processedPhotos]

    if (!enableNewSubmissionFlow) {
      // set photos for my collection, and submission flow state and Formik
      GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
        photos: allPhotos,
      })
      GlobalStore.actions.artworkSubmission.submission.setSubmissionIdForMyCollection(submissionId)
      GlobalStore.actions.artworkSubmission.submission.setPhotos({
        photos: allPhotos,
      })
    }

    setFieldValue("photos", allPhotos)
  }

  // show Native action sheet and get photos from user's phone
  const handleAddPhotoPress = async () => {
    const photos = await showPhotoActionSheet(showActionSheetWithOptions, true)
    if (photos?.length && submissionId) {
      addPhotosToSubmission(photos)
    }
  }

  // remove photo from submission and Formik values
  const handlePhotoDelete = async (photo: Photo) => {
    if (!submissionId) {
      console.error("Submission ID not found")
      return null
    }
    try {
      const filteredPhotos = values.photos.filter((p: Photo) => p.id !== photo.id)

      if (!enableNewSubmissionFlow) {
        // set photos for my collection, and submission flow state and Formik
        GlobalStore.actions.artworkSubmission.submission.setPhotosForMyCollection({
          photos: filteredPhotos,
        })

        GlobalStore.actions.artworkSubmission.submission.setSubmissionIdForMyCollection(
          submissionId
        )

        GlobalStore.actions.artworkSubmission.submission.setPhotos({
          photos: filteredPhotos,
        })
      }

      setFieldValue("photos", filteredPhotos)

      await removeAssetFromSubmission({ assetID: photo.id })
    } catch (error) {
      photo.error = true
      photo.errorMessage = "Photo could not be deleted"
      captureMessage(`handlePhotoDelete: ${JSON.stringify(error)}`)
    }
  }

  const numberOfPlaceholders = Math.max(3 - values.photos.length, 0)

  return (
    <Flex flexDirection="row" flexWrap="wrap" gap={space(1)}>
      {values.photos.map((photo: Photo, idx: number) => {
        return (
          <PhotoItem
            key={idx}
            photo={photo}
            onPhotoDelete={handlePhotoDelete}
            progress={progress[photo.path] ?? 0}
          />
        )
      })}

      {Array.from({ length: numberOfPlaceholders }).map((_, idx) => (
        <TouchableOpacity onPress={handleAddPhotoPress} key={idx}>
          <PlaceholderImage />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleAddPhotoPress}
        testID="Submission_Add_Photos_Button"
        disabled={isAnyPhotoLoading || isSizeLimitExceeded(values.photos)}
      >
        <Flex
          borderWidth={1}
          borderStyle="dashed"
          borderColor="blue100"
          height={IMAGE_SIZE}
          width={IMAGE_SIZE}
          justifyContent="center"
          alignItems="center"
          mt={1}
        >
          <AddIcon height={24} width={24} fill="blue100" />
          <Spacer y={0.5} />
          <Text variant="xs" color="blue100">
            Add Photos
          </Text>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}

const PlaceholderImage: React.FC = () => {
  return (
    <Flex
      borderWidth={1}
      borderStyle="dashed"
      borderColor="black30"
      height={IMAGE_SIZE}
      width={IMAGE_SIZE}
      justifyContent="center"
      alignItems="center"
      mt={1}
    >
      <ImageIcon height={ICON_SIZE} width={ICON_SIZE} fill="black60" />
    </Flex>
  )
}
export const tracks = {
  hasExceededUploadSize: (
    uploadSizeInBytes: number,
    numberOfFiles: number
  ): UploadSizeLimitExceeded => ({
    action: ActionType.uploadSizeLimitExceeded,
    context_owner_type: OwnerType.sell,
    upload_size_in_kb: Math.floor(Math.log2(uploadSizeInBytes) / 10),
    number_of_files: numberOfFiles,
  }),
}
