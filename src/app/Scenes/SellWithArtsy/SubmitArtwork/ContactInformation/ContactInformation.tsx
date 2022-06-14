import { captureMessage } from "@sentry/react-native"
import { ContactInformation_me$data } from "__generated__/ContactInformation_me.graphql"
import { ContactInformationQueryRendererQuery } from "__generated__/ContactInformationQueryRendererQuery.graphql"
import { ErrorView } from "app/Components/ErrorView/ErrorView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { consignmentSubmittedEvent } from "app/Scenes/SellWithArtsy/utils/TrackingEvent"
import { addClue, GlobalStore } from "app/store/GlobalStore"
import { Formik } from "formik"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import { PhoneInput } from "palette/elements/Input/PhoneInput/PhoneInput"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { updateConsignSubmission } from "../../mutations/updateConsignSubmissionMutation"
import { ContactInformationFormModel, contactInformationValidationSchema } from "./validation"

export const ContactInformation: React.FC<{
  handlePress: (submissionId: string) => void
  me: ContactInformation_me$data | null
}> = ({ handlePress, me }) => {
  const { userID } = GlobalStore.useAppState((store) => store.auth)
  const { submissionId } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)
  const [submissionError, setSubmissionError] = useState(false)
  const { trackEvent } = useTracking()

  const [isNameInputFocused, setIsNameInputFocused] = useState(false)
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false)
  const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false)
  const [isValidNumber, setIsValidNumber] = useState(false)

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
        addClue("ArtworkSubmissionMessage")
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

  return (
    <Formik<ContactInformationFormModel>
      initialValues={{
        userName: me?.name || "",
        userEmail: me?.email || "",
        userPhone: me?.phoneNumber?.isValid ? me?.phoneNumber?.originalNumber || "" : "",
      }}
      onSubmit={handleFormSubmit}
      validationSchema={contactInformationValidationSchema}
      validateOnMount
    >
      {({ values, isValid, errors, handleChange, handleSubmit }) => (
        <Flex py={1} mt={1}>
          <Text color="black60">
            We will only use these details to contact you regarding your submission.
          </Text>
          <Spacer mt={4} />
          <Input
            title="Name"
            placeholder="Your full name"
            onChangeText={handleChange("userName")}
            value={values.userName}
            accessibilityLabel="Name"
            onBlur={() => setIsNameInputFocused(false)}
            onFocus={() => setIsNameInputFocused(true)}
            error={!isNameInputFocused && values.userName && errors.userName ? errors.userName : ""}
          />
          <Spacer mt={4} />
          <Input
            title="Email"
            placeholder="Your email address"
            keyboardType="email-address"
            onChangeText={handleChange("userEmail")}
            value={values.userEmail}
            onBlur={() => setIsEmailInputFocused(false)}
            onFocus={() => setIsEmailInputFocused(true)}
            accessibilityLabel="Email address"
            error={
              !isEmailInputFocused && values.userEmail && errors.userEmail ? errors.userEmail : ""
            }
          />
          <Spacer mt={4} />
          <PhoneInput
            title="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={handleChange("userPhone")}
            value={values.userPhone}
            onBlur={() => setIsPhoneInputFocused(false)}
            setValidation={setIsValidNumber}
            onFocus={() => setIsPhoneInputFocused(true)}
            accessibilityLabel="Phone number"
            shouldDisplayLocalError={false}
            error={
              !isPhoneInputFocused && values.userPhone && !isValidNumber && errors.userPhone
                ? errors.userPhone
                : ""
            }
          />
          <Spacer mt={6} />
          <CTAButton onPress={handleSubmit} disabled={!isValid || !isValidNumber}>
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
