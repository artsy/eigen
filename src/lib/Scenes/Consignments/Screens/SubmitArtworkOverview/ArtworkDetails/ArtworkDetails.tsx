import { captureMessage } from "@sentry/react-native"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { BulletedItem, CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createOrUpdateSubmission } from "../utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { ErrorView } from "./Components/ErrorView"

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
    <Formik<ArtworkDetailsFormModel>
      initialValues={artworkDetails}
      onSubmit={handleArtworkDetailsSubmit}
      validationSchema={artworkDetailsValidationSchema}
      validateOnMount
    >
      {({ values, isValid }) => (
        <ScrollView>
          <Flex flexDirection="column" p={1} mt={1}>
            <BulletedItem>All fields are required to submit an artwork.</BulletedItem>
            <BulletedItem>
              Unfortunately, we do not allow{" "}
              <Text style={{ textDecorationLine: "underline" }}>
                artists to sell their own work
              </Text>{" "}
              on Artsy.
            </BulletedItem>
            <Spacer mt={4} />
            <ArtworkDetailsForm />
            <Spacer mt={3} />
            <CTAButton
              disabled={!isValid}
              onPress={() => handleArtworkDetailsSubmit(values)}
              testID="Submission_ArtworkDetails_Button"
            >
              Save & Continue
            </CTAButton>
          </Flex>
        </ScrollView>
      )}
    </Formik>
  )
}
