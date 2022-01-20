import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React from "react"
import * as Yup from "yup"

interface Props {
  handlePress: () => void
}
interface ContactInfoFormModel {
  name: string
  email: string
  phoneNumber: string
}
export const ContactInformation = ({ handlePress }: Props) => {
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required").trim(),
    email: Yup.string().email().required("Email field is required").trim(),
    phoneNumber: Yup.string().required("Please provide a valid phone number").trim(),
  })

  return (
    <Formik<ContactInfoFormModel>
      initialValues={{ name: "", email: "", phoneNumber: "" }}
      onSubmit={(values) => console.log(values)}
      validationSchema={schema}
      validateOnMount
    >
      {({ values, handleSubmit, setFieldValue, isValid }) => (
        <Flex p={1} mt={1}>
          <Text variant="sm" color="black60">
            We will only use these details to contact you regarding your submission.
          </Text>
          <Spacer mt={4} />
          <Input
            title="Name"
            placeholder="Your Full Name"
            onChangeText={(e) => setFieldValue("name", e)}
            value={values.name}
          />
          <Spacer mt={2} />
          <Input
            title="Email"
            placeholder="Your Email Address"
            onChangeText={(e) => setFieldValue("email", e)}
            value={values.email}
          />
          <Spacer mt={2} />
          <PhoneInput
            style={{ flex: 1 }}
            title="Phone number"
            placeholder="(000) 000 0000"
            onChangeText={(e) => setFieldValue("phoneNumber", e)}
            value={values.phoneNumber}
            setValidation={() => {
              //  validation function
            }}
          />
          <Spacer mt={6} />
          <Spacer mt={4} />
          <CTAButton
            onPress={() => {
              handleSubmit()
              handlePress()
            }}
            // disabled={!isValid}
          >
            Submit Artwork
          </CTAButton>
        </Flex>
      )}
    </Formik>
  )
}
