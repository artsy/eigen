import { BulletedItem, Spacer, Flex, LinkText } from "@artsy/palette-mobile"
import { CTAButton } from "app/Components/Button/CTAButton"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Formik } from "formik"
import React from "react"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "./validation"

export const ArtworkDetails: React.FC<{
  handlePress: (formValues: ArtworkDetailsFormModel) => void
  isLastStep: boolean
  scrollToTop?: () => void
}> = ({ handlePress, isLastStep, scrollToTop }) => {
  const { artworkDetails } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)

  return (
    <Flex flex={3} py={1} mt={1}>
      <BulletedItem>
        Currently, artists can not sell their own work on Artsy.{" "}
        <LinkText
          onPress={() =>
            navigate(
              "https://support.artsy.net/s/article/Im-an-artist-Can-I-submit-my-own-work-to-sell"
            )
          }
        >
          Learn more.
        </LinkText>
      </BulletedItem>
      <BulletedItem>All fields are required to submit an artwork.</BulletedItem>

      <Spacer y={4} />
      <Formik<ArtworkDetailsFormModel>
        initialValues={artworkDetails}
        onSubmit={handlePress}
        validationSchema={artworkDetailsValidationSchema}
        // Validate on blur only when injecting existing values from my collection
        validateOnMount={artworkDetails.myCollectionArtworkID ? true : false}
      >
        {({ values, isValid, dirty, validateForm }) => {
          return (
            <>
              <ArtworkDetailsForm />
              <Spacer y={2} />
              <CTAButton
                disabled={!isValid && dirty}
                onPress={() => {
                  validateForm().then((errors) => {
                    if (Object.keys(errors).length === 0) {
                      handlePress(values)
                    } else {
                      scrollToTop?.()
                    }
                  })
                }}
                testID="Submission_ArtworkDetails_Button"
              >
                {isLastStep ? "Submit Artwork" : "Save & Continue"}
              </CTAButton>
            </>
          )
        }}
      </Formik>
    </Flex>
  )
}
