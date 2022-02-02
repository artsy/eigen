import { captureMessage } from "@sentry/react-native"
import { ContactInformationQuery } from "__generated__/ContactInformationQuery.graphql"
import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { GlobalStore } from "lib/store/GlobalStore"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React, { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ErrorView } from "../Components/ErrorView"
import { updateConsignSubmission } from "../Mutations/updateConsignSubmissionMutation"
import { ContactInformationFormModel, contactInformationValidationSchema } from "./validation"

export const ContactInformation: React.FC<{
  handlePress: () => void
}> = ({ handlePress }) => {
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
      validateOnMount
      enableReinitialize
    >
      {({ values, setFieldValue, isValid }) => (
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
          />
          <Spacer mt={4} />
          <Input
            title="Email"
            placeholder="Your Email Address"
            onChangeText={(e) => setFieldValue("userEmail", e)}
            value={values.userEmail}
          />
          <Spacer mt={4} />
          <PhoneInput
            style={{ flex: 1 }}
            title="Phone number"
            placeholder="(000) 000 0000"
            onChangeText={(e) => setFieldValue("userPhone", e)}
            value={values.userPhone}
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
      phoneNumber {
        countryCode
        display
        error
        isValid
        originalNumber
        regionCode
      }
    }
  }
`
