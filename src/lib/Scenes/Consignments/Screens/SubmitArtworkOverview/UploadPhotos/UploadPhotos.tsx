import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { BulletedItem, Button, CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { uploadImageAndPassToGemini } from "../../../Submission/uploadPhotoToGemini"
import { ErrorView } from "../Components/ErrorView"
import { photosEmptyInitialValues, PhotosFormModel, photosValidationSchema } from "./validation"

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { showActionSheetWithOptions } = useActionSheet()
  const [photoUploadError, setPhotoUploadError] = useState(false)

  const addPhotoToSubmission = async (photos: PhotosFormModel[]) => {
    try {
      for (const photo of photos) {
        if (photo.path) {
          await uploadImageAndPassToGemini(photo.path, "private", submission.submissionId)
          GlobalStore.actions.artworkSubmission.submission.setPhotos([...submission.photos, photo])
        }
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setPhotoUploadError(true)
    }
  }

  const handleAddPhotoClick = async () => {
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

  if (photoUploadError) {
    return <ErrorView />
  }

  return (
    <Flex p={1} mt={1} style={{ height: 700 }}>
      <Flex>
        <BulletedItem>
          To evaluate your submission faster, please upload high-quality photos of the work's front
          and back.
        </BulletedItem>
        <BulletedItem>
          If possible, include photos of any signatures or certificates of authenticity.
        </BulletedItem>
      </Flex>

      <Formik<PhotosFormModel[]>
        initialValues={photosEmptyInitialValues}
        onSubmit={handlePress}
        validationSchema={photosValidationSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <>
            <Flex
              style={{ borderColor: "lightgray", borderWidth: 1 }}
              mt={4}
              mb={2}
              p={2}
              pt={3}
              pb={3}
            >
              <Text variant="lg" color="black100" marginBottom={1}>
                Add Files Here
              </Text>
              <Text variant="md" color="black60" marginBottom={1}>
                Files Supported: JPG, PNG
              </Text>
              <Text variant="md" color="black60" marginBottom={3}>
                Total Maximum Size: 30MB
              </Text>
              <Button onPress={handleAddPhotoClick} variant="outline" size="large" block>
                Add Photo
              </Button>
              <Spacer mt={1} />
            </Flex>
            <CTAButton disabled={!isValid} onPress={handlePress} testID="Submission_Photos_Button">
              Save & Continue
            </CTAButton>
          </>
        )}
      </Formik>
    </Flex>
  )
}
