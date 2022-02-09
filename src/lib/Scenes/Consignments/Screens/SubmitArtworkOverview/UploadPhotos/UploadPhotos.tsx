import { Formik } from "formik"
import { BulletedItem, CTAButton, Flex, Spacer } from "palette"
import React, { useState } from "react"
import { ErrorView } from "../Components/ErrorView"
import { UploadPhotosForm } from "./UploadPhotosForm"
import {
  Photo,
  photosEmptyInitialValues,
  PhotosFormModel,
  photosValidationSchema,
} from "./validation"

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const [photoUploadError, setPhotoUploadError] = useState(false)

  if (photoUploadError) {
    return <ErrorView />
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
        initialValues={photosEmptyInitialValues}
        onSubmit={handlePress}
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
                onPress={handlePress}
                testID="Submission_Photos_Button"
              >
                {!!isAnyPhotoLoading ? "Loading Photos..." : "Save & Continue"}
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
  )
}
