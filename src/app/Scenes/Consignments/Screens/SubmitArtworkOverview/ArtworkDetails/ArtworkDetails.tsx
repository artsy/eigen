import { captureMessage } from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { BulletedItem, CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ErrorView } from "../Components/ErrorView"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "./validation"

export const ArtworkDetails: React.FC<{ handlePress: () => void }> = ({ handlePress }) => {
  const { submissionId, artworkDetails } = GlobalStore.useAppState(
    (state) => state.artworkSubmission.submission
  )
  const [submissionError, setSubmissionError] = useState(false)

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    try {
      const id = await createOrUpdateSubmission(values, submissionId)
      if (id) {
        GlobalStore.actions.artworkSubmission.submission.setSubmissionId(id)
        GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(values)
        handlePress()
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setSubmissionError(true)
    }
  }

  if (submissionError) {
    return <ErrorView />
  }

  return (
    <Flex flex={3} p={1} mt={1}>
      <BulletedItem>
        Currently, artists can not sell their own work on Artsy.{" "}
        <Text style={{ textDecorationLine: "underline" }}>Learn more.</Text>
      </BulletedItem>
      <BulletedItem>All fields are required to submit an artwork.</BulletedItem>

      <Spacer mt={4} />
      <Formik<ArtworkDetailsFormModel>
        initialValues={artworkDetails}
        onSubmit={handleArtworkDetailsSubmit}
        validationSchema={artworkDetailsValidationSchema}
        validateOnMount
      >
        {({ values, isValid }) => (
          <>
            <ArtworkDetailsForm />
            <Spacer mt={2} />
            <CTAButton
              disabled={!isValid}
              onPress={() => handleArtworkDetailsSubmit(values)}
              testID="Submission_ArtworkDetails_Button"
            >
              Save & Continue
            </CTAButton>
          </>
        )}
      </Formik>
    </Flex>
  )
}
