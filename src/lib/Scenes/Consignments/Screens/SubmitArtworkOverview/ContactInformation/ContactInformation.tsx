import { captureMessage } from "@sentry/react-native"
import { ContactInformation_me } from "__generated__/ContactInformation_me.graphql"
import { ContactInformationQueryRendererQuery } from "__generated__/ContactInformationQueryRendererQuery.graphql"
import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ErrorView } from "../Components/ErrorView"
import { updateConsignSubmission } from "../Mutations/updateConsignSubmissionMutation"
import {
  contactInformationEmptyInitialValues,
  ContactInformationFormModel,
  contactInformationValidationSchema,
} from "../utils/validation"

interface Props {
  // handlePress: () => void
  me: ContactInformation_me | null
}

export const ContactInformation: React.FC<Props> = (
  {
    // handlePress, me
  }
) => {
  const { submissionId } = GlobalStore.useAppState((state) => state.artworkSubmission.submission)
  const [submissionError, setSubmissionError] = useState(false)

  // me now has what is asked for in the Fragment
  //  console.log({ me })

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
        // handlePress()
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
      initialValues={contactInformationEmptyInitialValues}
      onSubmit={handleSubmit}
      validationSchema={contactInformationValidationSchema}
      validateOnMount
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

export const ContactInformationContainer = createFragmentContainer(ContactInformation, {
  me: graphql`
    fragment ContactInformation_me on Me {
      name
      email
    }
  `,
})

export const ContactInformationQueryRenderer: React.FC = () => {
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
      render={renderWithPlaceholder({
        Container: ContactInformationContainer,
        renderPlaceholder: SaleInfoPlaceholder,
      })}
    />
  )
}

const SaleInfoPlaceholder = () => <Text>some placeholder</Text>
