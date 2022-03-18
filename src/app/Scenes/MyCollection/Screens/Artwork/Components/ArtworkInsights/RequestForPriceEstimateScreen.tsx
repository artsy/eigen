import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Box, BulletedItem, Flex, Input, Join, PhoneInput, Spacer, Text } from "palette"
import React, { useState } from "react"
import { Platform, ScrollView } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import * as Yup from "yup"
import { RequestForPriceEstimateForm } from "./RequestForPriceEstimateForm"

interface RequestForPriceEstimateScreenProps {
  email: string
  name: string
  phone: string
}

export interface RequestForPriceEstimateFormikSchema {
  requesterName: string
  requesterEmail: string
  requesterPhoneNumber: string
}

const ValidationSchema = Yup.object().shape({
  requesterName: Yup.string().required("Name field is required").min(1, "Name field is required"),
  requesterEmail: Yup.string()
    .required("Email field is required")
    .email("Please provide a valid email address"),
})

export const RequestForPriceEstimateScreen: React.FC<RequestForPriceEstimateScreenProps> = ({
  email,
  name,
  phone,
}) => {
  const formik = useFormik<RequestForPriceEstimateFormikSchema>({
    validateOnChange: true,
    initialValues: {
      requesterEmail: email,
      requesterName: name,
      requesterPhoneNumber: phone,
    },
    onSubmit: async ({ requesterEmail, requesterName, requesterPhoneNumber }) => {
      // submit
      const input = { artworkId: "", requesterEmail, requesterName, requesterPhoneNumber }
      // commitMutation<requestForPriceEstimateScreenMutation>(defaultEnvironment, {
      //   mutation: graphql`
      //     mutation requestForPriceEstimateScreenMutation($input: RequestPriceEstimateInput!) {
      //       requestPriceEstimate(input: $input)
      //     }
      //   `,
      //   variables: { input },
      //   onCompleted: () => {},
      //   onError: () => {},
      // })
    },
    validationSchema: ValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <RequestForPriceEstimateForm />
    </FormikProvider>
  )
}
