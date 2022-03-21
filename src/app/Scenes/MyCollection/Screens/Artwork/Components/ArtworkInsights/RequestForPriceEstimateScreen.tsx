import { RequestForPriceEstimateScreenMutation } from "__generated__/RequestForPriceEstimateScreenMutation.graphql"
import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { Toast } from "app/Components/Toast/Toast"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { FormikProvider, useFormik, useFormikContext } from "formik"
import { Box, BulletedItem, Flex, Input, Join, PhoneInput, Spacer, Text } from "palette"
import React, { useState } from "react"
import { Alert, Platform, ScrollView } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import * as Yup from "yup"
import { RequestForPriceEstimateForm } from "./RequestForPriceEstimateForm"

interface RequestForPriceEstimateScreenProps {
  artworkId: string
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
  artworkId,
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
      const input = { artworkId, requesterEmail, requesterName, requesterPhoneNumber }
      commitMutation<RequestForPriceEstimateScreenMutation>(defaultEnvironment, {
        mutation: graphql`
          mutation RequestForPriceEstimateScreenMutation($input: RequestPriceEstimateInput!) {
            requestPriceEstimate(input: $input) {
              priceEstimateParamsOrError {
                ... on RequestPriceEstimatedMutationSuccess {
                  submittedPriceEstimateParams {
                    artworkId
                    requesterName
                    requesterEmail
                  }
                }
                ... on RequestPriceEstimatedMutationFailure {
                  mutationError {
                    error
                  }
                }
              }
            }
          }
        `,
        variables: { input },
        onCompleted: (response) => {
          const myCollectionArtworkId =
            response.requestPriceEstimate?.priceEstimateParamsOrError?.submittedPriceEstimateParams
              ?.artworkId
          if (myCollectionArtworkId) {
            GlobalStore.actions.requestedPriceEstimates.addRequest({
              artworkId: myCollectionArtworkId,
              requestedAt: new Date().getTime(),
            })
            Toast.show(
              "Request Sent. \nAn Artsy Specialist will contact you with a response",
              "top",
              { backgroundColor: "blue100" }
            )
            goBack()
          }
        },
        onError: () => {
          Toast.show("Error: Failed to send a price estimate request.", "top", {
            backgroundColor: "red100",
          })
        },
      })
    },
    validationSchema: ValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <RequestForPriceEstimateForm />
    </FormikProvider>
  )
}
