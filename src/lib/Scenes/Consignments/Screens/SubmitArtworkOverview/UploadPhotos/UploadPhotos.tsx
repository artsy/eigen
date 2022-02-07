import { useActionSheet } from "@expo/react-native-action-sheet"
import { captureMessage } from "@sentry/react-native"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { uniqBy } from "lodash"
import { BulletedItem, Button, CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ErrorView } from "../Components/ErrorView"
import { PhotosFormModel, photosValidationSchema } from "./validation"

// TODO: get & set photos from and to GlobalStore
let photos: PhotosFormModel[] = []
console.log({ photos })

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const { submissionId } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)
  const { showActionSheetWithOptions } = useActionSheet()
  const [photoUploadError, setPhotoUploadError] = useState(false)

  const handlePhotosSubmit = async (values: PhotosFormModel[]) => {
    console.log({ values })

    try {
      if (submissionId) {
        // const id = await addAssetToConsignment(submissionId)
        // if (id) {
        // GlobalStore.actions.artworkSubmission.submission.setPhotos(photos)
        handlePress()
        // }
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setPhotoUploadError(true)
    }
  }

  const addPhotos = (photo: PhotosFormModel[]) => {
    photos = uniqBy(photos.concat(photo), (p) => p.imageURL || p.path)
    // GlobalStore.setPhotos(allPhotos)
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
        initialValues={photos}
        onSubmit={handlePhotosSubmit}
        validationSchema={photosValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => (
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
              <Button
                onPress={() => {
                  showPhotoActionSheet(showActionSheetWithOptions, true).then((photo) => {
                    addPhotos(photo)
                  })
                }}
                variant="outline"
                size="large"
                block
              >
                Add Photo
              </Button>
              <Spacer mt={1} />
            </Flex>
            <CTAButton
              disabled={!isValid}
              onPress={() => handlePhotosSubmit(values)}
              testID="Submission_Photos_Button"
            >
              Save & Continue
            </CTAButton>
          </>
        )}
      </Formik>
    </Flex>
  )
}
