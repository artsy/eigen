import { captureMessage } from "@sentry/react-native"
import { ContactInformation_me } from "__generated__/ContactInformation_me.graphql"
import { ContactInformationQueryRendererQuery } from "__generated__/ContactInformationQueryRendererQuery.graphql"
import { PhoneInput } from "app/Components/PhoneInput/PhoneInput"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { consignmentSubmittedEvent } from "app/Scenes/Consignments/Utils/TrackingEvent"
import { addClue, GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ErrorView } from "../Components/ErrorView"
import { updateConsignSubmission } from "../Mutations/updateConsignSubmissionMutation"
import { ContactInformationFormModel, contactInformationValidationSchema } from "./validation"

export const ContactInformation: React.FC<{
  handlePress: (submissionId: string) => void
  me: ContactInformation_me | null
}> = ({ handlePress, me }) => {
  const { userID } = GlobalStore.useAppState((store) => store.auth)
  const { submissionId } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)
  const [submissionError, setSubmissionError] = useState(false)
  const { trackEvent } = useTracking()
  const handleFormSubmit = async (formValues: ContactInformationFormModel) => {
    try {
      const updatedSubmissionId = await updateConsignSubmission({
        id: submissionId,
        userName: formValues.userName,
        userEmail: formValues.userEmail,
        userPhone: formValues.userPhone,
        state: "SUBMITTED",
      })

      if (updatedSubmissionId) {
        trackEvent(consignmentSubmittedEvent(updatedSubmissionId, formValues.userEmail, userID))

        GlobalStore.actions.artworkSubmission.submission.resetSessionState()
        addClue("ArtworkSubmissionBanner")
        handlePress(submissionId)
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setSubmissionError(true)
    }
  }

  if (submissionError) {
    return <ErrorView />
  }

  const userName = me?.name || ""
  const userEmail = me?.email || ""
  const userPhone = me?.phoneNumber?.isValid ? me?.phoneNumber?.originalNumber || "" : ""

  return (
    <Formik<ContactInformationFormModel>
      initialValues={{
        userName,
        userEmail,
        userPhone,
      }}
      onSubmit={handleFormSubmit}
      validationSchema={contactInformationValidationSchema}
      validateOnMount
    >
      {({ values, isValid, touched, errors, handleChange, handleBlur, handleSubmit }) => (
        <Flex py={1} mt={1}>
          <Text color="black60">
            We will only use these details to contact you regarding your submission.
          </Text>
          <Spacer mt={4} />
          <Input
            title="Name"
            placeholder="Your Full Name"
            onChangeText={handleChange("userName")}
            value={values.userName}
            onBlur={handleBlur("userName")}
            error={touched.userName ? errors.userName : undefined}
            accessibilityLabel="Name"
          />
          <Spacer mt={4} />
          <Input
            title="Email"
            placeholder="Your Email Address"
            keyboardType="email-address"
            onChangeText={handleChange("userEmail")}
            value={values.userEmail}
            onBlur={handleBlur("userEmail")}
            accessibilityLabel="Email address"
            error={touched.userEmail ? "This email address is invalid" : undefined}
          />
          <Spacer mt={4} />
          <PhoneInput
            style={{ flex: 1 }}
            title="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={handleChange("userPhone")}
            value={values.userPhone}
            setValidation={() => {
              // do nothing
            }}
            onBlur={handleBlur("userPhone")}
            accessibilityLabel="Phone number"
          />
          <Spacer mt={6} />
          <CTAButton onPress={handleSubmit} disabled={!isValid}>
            Submit Artwork
          </CTAButton>
        </Flex>
      )}
    </Formik>
  )
}

export const ContactInformationFragmentContainer = createFragmentContainer(ContactInformation, {
  me: graphql`
    fragment ContactInformation_me on Me {
      name
      email
      phoneNumber {
        isValid
        originalNumber
      }
    }
  `,
})

export const ContactInformationQueryRenderer: React.FC<{
  handlePress: (submissionId: string) => void
}> = ({ handlePress }) => {
  return (
    <QueryRenderer<ContactInformationQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ContactInformationQueryRendererQuery {
          me {
            ...ContactInformation_me
          }
        }
      `}
      variables={{}}
      render={({ error, props }) => {
        if (error || !props?.me) {
          return null
        }

        return <ContactInformationFragmentContainer handlePress={handlePress} me={props?.me} />
      }}
    />
  )
}
