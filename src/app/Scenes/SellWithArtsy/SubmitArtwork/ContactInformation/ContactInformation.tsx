import { Flex, Input2, Spacer, Text } from "@artsy/palette-mobile"
import { ContactInformationQueryRendererQuery } from "__generated__/ContactInformationQueryRendererQuery.graphql"
import { ContactInformation_me$data } from "__generated__/ContactInformation_me.graphql"
import { CTAButton } from "app/Components/Button/CTAButton"
import { PhoneInput } from "app/Components/Input/PhoneInput/PhoneInput"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Formik } from "formik"
import { noop } from "lodash"
import React, { useState } from "react"
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay"
import { ContactInformationFormModel, contactInformationValidationSchema } from "./validation"

export const ContactInformation: React.FC<{
  handlePress: (formValues: ContactInformationFormModel) => void
  me: ContactInformation_me$data | null
  isLastStep: boolean
}> = ({ handlePress, me, isLastStep }) => {
  const [isNameInputFocused, setIsNameInputFocused] = useState(false)
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false)

  const handleFormSubmit = (formValues: ContactInformationFormModel) => {
    handlePress(formValues)
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
          <Spacer y={4} />
          <Input2
            title="Name"
            placeholder="Your full name"
            onChangeText={handleChange("userName")}
            value={values.userName}
            accessibilityLabel="Name"
            onBlur={() => setIsNameInputFocused(false)}
            onFocus={() => setIsNameInputFocused(true)}
            error={!isNameInputFocused && values.userName && errors.userName ? errors.userName : ""}
          />
          <Spacer y={4} />
          <Input2
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
          <Spacer y={4} />
          <PhoneInput
            title="Phone number"
            placeholder="(000) 000-0000"
            onChangeText={handleChange("userPhone")}
            value={values.userPhone}
            setValidation={noop}
            accessibilityLabel="Phone number"
            shouldDisplayLocalError={false}
          />
          <Spacer y={6} />
          <CTAButton
            testID="Submission_ContactInformation_Button"
            onPress={handleSubmit}
            disabled={!isValid}
          >
            {isLastStep ? "Submit Artwork" : "Save & Continue"}
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
  handlePress: (formValues: ContactInformationFormModel) => void
  isLastStep: boolean
}> = ({ handlePress, isLastStep }) => {
  return (
    <QueryRenderer<ContactInformationQueryRendererQuery>
      environment={getRelayEnvironment()}
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

        return (
          <ContactInformationFragmentContainer
            handlePress={handlePress}
            me={props?.me}
            isLastStep={isLastStep}
          />
        )
      }}
    />
  )
}
