import { captureMessage } from "@sentry/react-native"
import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { navigate } from "app/navigation/navigate"
import { artworkDetailsCompletedEvent } from "app/Scenes/SellWithArtsy/utils/TrackingEvent"
import { GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { BulletedItem, CTAButton, Flex, LinkText, Spacer } from "palette"
import React, { useState } from "react"
import { useTracking } from "react-tracking"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "./validation"

export const ArtworkDetails: React.FC<{ handlePress: () => void }> = ({ handlePress }) => {
  const { userID, userEmail } = GlobalStore.useAppState((state) => state.auth)
  const { submissionId, artworkDetails } = GlobalStore.useAppState(
    (state) => state.artworkSubmission.submission
  )
  const { trackEvent } = useTracking()
  const [submissionError, setSubmissionError] = useState(false)

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    try {
      const id = await createOrUpdateSubmission(values, submissionId)
      if (id) {
        GlobalStore.actions.artworkSubmission.submission.setSubmissionId(id)
        GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(values)

        trackEvent(artworkDetailsCompletedEvent(id, userEmail, userID))

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
    <Flex flex={3} py={1} mt={1}>
      <BulletedItem>
        Currently, artists can not sell their own work on Artsy.{" "}
        <LinkText
          onPress={() =>
            navigate(
              "https://support.artsy.net/hc/en-us/articles/360046646374-I-m-an-artist-Can-I-submit-my-own-work-to-sell-"
            )
          }
        >
          Learn more.
        </LinkText>
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
