import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React from "react"
import * as Yup from "yup"
import { updateConsignSubmission } from "../mutations/updateConsignSubmissionMutation"

interface Props {
  handlePress: () => void
}
// Update this to get the submissionId from globalStore
const submissionId = "72504"

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

  const handleError = () => {
    // let's add error display here
    console.log("handling error")
  }
  const handleSubmit = async (values: ContactInfoFormModel) => {
    try {
      const updateResults = await updateConsignSubmission({
        id: submissionId,
        userName: values.name,
        userEmail: values.email,
        userPhone: values.phoneNumber,
      })
      if (updateResults) {
        handlePress()
      }
    } catch (error) {
      console.log("error whiles", error)
      handleError()

      // remove submissions
      // GlobalStore.actions.artworkSubmission.submission.resetSessionState()
    }
  }

  return (
    <Formik<ContactInfoFormModel>
      initialValues={{ name: "", email: "", phoneNumber: "" }}
      onSubmit={(values) => console.log(values)}
      validationSchema={schema}
      validateOnMount
    >
      {({ values, setFieldValue, isValid }) => (
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
          <Spacer mt={4} />
          <Input
            title="Email"
            placeholder="Your Email Address"
            onChangeText={(e) => setFieldValue("email", e)}
            value={values.email}
          />
          <Spacer mt={4} />
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
