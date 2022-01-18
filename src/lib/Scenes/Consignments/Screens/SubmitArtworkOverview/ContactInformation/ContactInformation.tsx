import { Formik } from "formik"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React from "react"
export interface FormikSchema {
  name: string
  email: string
  phoneNumber: string
}
export const ContactInformation = ({}: // handlePress,
{
  handlePress: () => void
}) => {
  return (
    <Formik
      initialValues={{ name: "", email: "", phoneNumber: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleSubmit, setFieldValue, isValid }) => (
        <Flex p={1} mt={1}>
          <Text variant="sm" color="black60">
            We will only use these details to contact you regarding your
            submission.
          </Text>
          <Spacer mt={1} />
          <Input
            title="Name"
            placeholder="Name"
            onChange={(e) => setFieldValue("name", e)}
            value={values.name}
          />
          <Spacer mt={2} />
          <Input
            title="Email"
            placeholder="in"
            onChange={(e) => setFieldValue("email", e)}
            value={values.email}
          />
          <Spacer mt={2} />
          <Input
            title="Phone number"
            placeholder="in"
            onChange={(e) => setFieldValue("phoneNumber", e)}
            value={values.phoneNumber}
          />
          <Spacer mt={2} />
          <CTAButton onPress={handleSubmit} disabled={!isValid}>
            Submit Artwork
          </CTAButton>
        </Flex>
      )}
    </Formik>
  )
}
