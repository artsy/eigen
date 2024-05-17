import { BulletedItem, Flex, Spacer } from "@artsy/palette-mobile"
import { CTAButton } from "app/Components/Button/CTAButton"
import { useBottomTabBarHeight } from "app/Scenes/BottomTabs/useBottomTabBarHeight"
import {
  Photo,
  PhotosFormModel,
  photosValidationSchema,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/validation"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { useRef, useState } from "react"
import { UploadPhotosForm } from "./UploadPhotosForm"
import { isSizeLimitExceeded } from "./utils/calculatePhotoSize"

export const UploadPhotos = ({
  handlePress,
  isLastStep,
}: {
  handlePress: ({}) => Promise<void>
  isLastStep: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { submission } = GlobalStore.useAppState((state) => state.artworkSubmission)
  const initialSubmissionPhotos = useRef(submission.photos).current
  const bottomTabBarHeight = useBottomTabBarHeight()

  const submitUploadPhotosStep = () => {
    handlePress({})
  }

  return (
    <Flex py={1} mt={1} mb={`${bottomTabBarHeight}px`}>
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
        initialValues={initialSubmissionPhotos}
        onSubmit={submitUploadPhotosStep}
        validationSchema={photosValidationSchema}
        validateOnChange
        validateOnMount
      >
        {({ values, isValid }) => {
          const isAnyPhotoLoading = values.photos.some((photo: Photo) => photo.loading)

          return (
            <>
              <UploadPhotosForm isAnyPhotoLoading={isAnyPhotoLoading} />
              <Spacer y={2} />
              <CTAButton
                disabled={
                  !isValid || isAnyPhotoLoading || isSizeLimitExceeded(values.photos) || isLoading
                }
                loading={isLoading}
                onPress={async () => {
                  try {
                    setIsLoading(true)
                    await handlePress({})
                  } finally {
                    setIsLoading(false)
                  }
                }}
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
