import { Formik } from "formik"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React from "react"
import * as Yup from "yup"
import { updateConsignSubmission } from "../Mutations/updateConsignSubmissionMutation"

interface Props {
  handlePress: () => void
}
// Update this to get the submissionId from globalStore
const submissionId = "72504"

export interface ContactInformationFormModel {
  userName: string
  userEmail: string
  userPhone: string
}
export const ContactInformation = ({ handlePress }: Props) => {
  const schema = Yup.object().shape({
    userName: Yup.string().required("Please provide a name").trim(),
    userEmail: Yup.string().email().required("Please provide a valid Email").trim(),
    userPhone: Yup.string().required("Please provide a valid phone number").trim(),
  })

  const handleError = () => {
    // let's add error display here
    console.log("handling error")
  }

  const handleSubmit = async (values: ContactInformationFormModel) => {
    try {
      const updateResults = await updateConsignSubmission({
        id: submissionId,
        userName: values.userName,
        userEmail: values.userEmail,
        userPhone: values.userPhone,
      })
      if (updateResults) {
        handlePress()
      }
    } catch (error) {
      console.log("error while", error)
      handleError()

      // remove submissions
      // GlobalStore.actions.artworkSubmission.submission.resetSessionState()
    }
  }

  return (
    <Formik<ContactInformationFormModel>
      initialValues={{ userName: "", userEmail: "", userPhone: "" }}
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
