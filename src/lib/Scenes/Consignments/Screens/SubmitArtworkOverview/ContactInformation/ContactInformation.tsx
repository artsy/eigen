import { captureMessage } from "@sentry/react-native"
import { ContactInformationQuery } from "__generated__/ContactInformationQuery.graphql"
import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { Placeholder } from "lib/Scenes/ViewingRoom/ViewingRoomArtwork"
import { GlobalStore } from "lib/store/GlobalStore"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React, { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ErrorView } from "../Components/ErrorView"
import { updateConsignSubmission } from "../Mutations/updateConsignSubmissionMutation"
import { ContactInformationFormModel, contactInformationValidationSchema } from "./validation"

interface ContactInformationProps {
  handlePress: () => void
}

export const ContactInformationScreen: React.FC<ContactInformationProps> = ({ handlePress }) => (
  <Suspense
    fallback={
      <Flex minHeight="800">
        <Placeholder />
      </Flex>
    }
  >
    <ContactInformation handlePress={handlePress} />
  </Suspense>
)
export const ContactInformation: React.FC<ContactInformationProps> = ({ handlePress }) => {
  const { submissionId } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)
  const [submissionError, setSubmissionError] = useState(false)
  const queryData = useLazyLoadQuery<ContactInformationQuery>(ContactInformationScreenQuery, {})

  const name = queryData?.me?.name || ""
  const email = queryData?.me?.email || ""
  const phone = queryData?.me?.phone || ""

  const handleSubmit = async (values: ContactInformationFormModel) => {
    try {
      const updatedSubmissionId = await updateConsignSubmission({
        id: submissionId,
        userName: values.userName,
        userEmail: values.userEmail,
        userPhone: values.userPhone,
        state: "SUBMITTED",
      })

      if (updatedSubmissionId) {
        GlobalStore.actions.artworkSubmission.submission.resetSessionState()
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
    <Formik<ContactInformationFormModel>
      initialValues={{
        userName: name,
        userEmail: email,
        userPhone: phone,
      }}
      onSubmit={handleSubmit}
      validationSchema={contactInformationValidationSchema}
      validateOnBlur
      enableReinitialize
    >
      {({ values, setFieldValue, isValid, errors }) => (
        <Flex p={1} mt={1}>
          <Text color="black60">
            We will only use these details to contact you regarding your submission.
          </Text>
          <Spacer mt={4} />
          <Input
            title="Name"
            placeholder="Your Full Name"
            onChangeText={(e) => setFieldValue("userName", e)}
            value={values.userName}
            error={errors.userName}
          />
          <Spacer mt={4} />
          <Input
            title="Email"
            placeholder="Your Email Address"
            onChangeText={(e) => setFieldValue("userEmail", e)}
            value={values.userEmail}
            error={errors.userEmail}
          />
          <Spacer mt={4} />
          <PhoneInput
            style={{ flex: 1 }}
            title="Phone number"
            placeholder="(000) 000 0000"
            onChangeText={(e) => setFieldValue("userPhone", e)}
            value={values.userPhone}
            error={errors.userPhone}
            setValidation={() => {
              //  validation function
            }}
          />
          <Spacer mt={6} />
          <CTAButton
            onPress={() => {
              handleSubmit(values)
            }}
            disabled={!isValid}
          >
            Submit Artwork
          </CTAButton>
          <Spacer mt={2} />
        </Flex>
      )}
    </Formik>
  )
}

export const ContactInformationScreenQuery = graphql`
  query ContactInformationQuery {
    me {
      name
      email
      phone
    }
  }
`

// TODO:
// Pre-populate phone number from a user's `phoneNumber` field
// https://artsyproduct.atlassian.net/browse/SWA-224
//
// scheme
//
// me {
//   name
//   email
//   phone
//   phoneNumber {
//     countryCode
//     display
//     error
//     isValid
//     originalNumber
//     regionCode
//   }
// }
