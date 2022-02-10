import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { BulletedItem, CTAButton, Flex, Spacer } from "palette"
import React, { useState } from "react"
import { ErrorView } from "../Components/ErrorView"
import { UploadPhotosForm } from "./UploadPhotosForm"
import { Photo, PhotosFormModel, photosValidationSchema } from "./validation"

// TODO: consider using formik errors
//  TODO: manual testing
//  TODO: tests

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const [photoUploadError, setPhotoUploadError] = useState(false)

  if (photoUploadError) {
    return <ErrorView />
  }

  const handlePhotosSavePress = (values: PhotosFormModel) => {
    GlobalStore.actions.artworkSubmission.submission.setPhotos({
      photos: [...values.photos],
    })
    handlePress()
  }

  return (
    <Flex p={1} mt={1}>
      <Flex>
        <BulletedItem>
          To evaluate your submission faster, please upload high-quality photos of the work's front
          and back.
        </BulletedItem>
        <BulletedItem>
          If possible, include photos of any signatures or certificates of authenticity.
        </BulletedItem>
      </Flex>

      <Formik<PhotosFormModel>
        initialValues={submission.photos}
        onSubmit={handlePhotosSavePress}
        validationSchema={photosValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => {
          const isAnyPhotoLoading = values.photos.some((photo: Photo) => photo.loading)
          const isAnyPhotoError = values.photos.some((photo: Photo) => photo.error)

          return (
            <>
              <UploadPhotosForm setPhotoUploadError={setPhotoUploadError} />
              <Spacer mt={2} />
              <CTAButton
                disabled={!isValid || isAnyPhotoLoading || isAnyPhotoError}
                onPress={() => handlePhotosSavePress(values)}
                testID="Submission_Photos_Button"
              >
                {!!isAnyPhotoLoading ? "Processing Photos..." : "Save & Continue"}
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
  )
}
