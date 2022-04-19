import {
  Photo,
  PhotosFormModel,
  photosValidationSchema,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { uploadPhotosCompletedEvent } from "app/Scenes/SellWithArtsy/utils/TrackingEvent"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { BulletedItem, CTAButton, Flex, Spacer } from "palette"
import React from "react"
import { useTracking } from "react-tracking"
import { UploadPhotosForm } from "./UploadPhotosForm"
import { isSizeLimitExceeded } from "./utils/calculatePhotoSize"

export const UploadPhotos = ({ handlePress }: { handlePress: () => void }) => {
  const { userID, userEmail } = GlobalStore.useAppState((state) => state.auth)
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const { trackEvent } = useTracking()

  const submitUploadPhotosStep = () => {
    trackEvent(uploadPhotosCompletedEvent(submission.submissionId, userEmail, userID))

    handlePress()
  }

  return (
    <Flex py={1} mt={1}>
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
        onSubmit={submitUploadPhotosStep}
        validationSchema={photosValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => {
          const isAnyPhotoLoading = values.photos.some((photo: Photo) => photo.loading)

          return (
            <>
              <UploadPhotosForm isAnyPhotoLoading={isAnyPhotoLoading} />
              <Spacer mt={2} />
              <CTAButton
                disabled={!isValid || isAnyPhotoLoading || isSizeLimitExceeded(values.photos)}
                onPress={submitUploadPhotosStep}
                testID="Submission_Save_Photos_Button"
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
