import { Spacer } from "@artsy/palette-mobile"
import {
  Photo,
  PhotosFormModel,
  photosValidationSchema,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { BulletedItem, CTAButton, Flex } from "palette"
import { UploadPhotosForm } from "./UploadPhotosForm"
import { isSizeLimitExceeded } from "./utils/calculatePhotoSize"

export const UploadPhotos = ({
  handlePress,
  isLastStep,
}: {
  handlePress: ({}) => void
  isLastStep: boolean
}) => {
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)

  const submitUploadPhotosStep = () => {
    handlePress({})
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
              <Spacer y="2" />
              <CTAButton
                disabled={!isValid || isAnyPhotoLoading || isSizeLimitExceeded(values.photos)}
                onPress={() => submitUploadPhotosStep()}
                testID="Submission_Save_Photos_Button"
              >
                {!!isAnyPhotoLoading
                  ? "Processing Photos..."
                  : isLastStep
                  ? "Submit Artwork"
                  : "Save & Continue"}
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
  )
}
