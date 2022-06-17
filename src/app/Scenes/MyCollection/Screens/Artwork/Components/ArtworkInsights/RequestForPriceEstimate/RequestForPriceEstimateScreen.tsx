import { ActionType, ContextModule, OwnerType, SentRequestPriceEstimate } from "@artsy/cohesion"
import { RequestForPriceEstimateScreenMutation } from "__generated__/RequestForPriceEstimateScreenMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { goBack } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStore } from "app/store/GlobalStore"
import { FormikProvider, useFormik } from "formik"
import React from "react"
import { Environment } from "react-relay"
import { useTracking } from "react-tracking"
import { commitMutation, graphql } from "relay-runtime"
import { ArtsyKeyboardAvoidingViewContext } from "shared/utils"
import * as Yup from "yup"
import { RequestForPriceEstimateForm } from "./RequestForPriceEstimateForm"

interface RequestForPriceEstimateScreenProps {
  artworkID: string
  artworkSlug: string
  demandRank?: number
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

export const requestForPriceEstimateMutation = (
  environment: Environment,
  onCompleted: (response: RequestForPriceEstimateScreenMutation["response"]) => void,
  onError: () => void,
  input: RequestForPriceEstimateFormikSchema & { artworkId: string }
) => {
  commitMutation<RequestForPriceEstimateScreenMutation>(environment, {
    mutation: graphql`
      mutation RequestForPriceEstimateScreenMutation($input: RequestPriceEstimateInput!) {
        requestPriceEstimate(input: $input) {
          priceEstimateParamsOrError {
            ... on RequestPriceEstimatedMutationSuccess {
              submittedPriceEstimateParams {
                artworkId
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
    onCompleted,
    onError,
  })
}

export const RequestForPriceEstimateScreen: React.FC<RequestForPriceEstimateScreenProps> = ({
  artworkID,
  artworkSlug,
  demandRank,
  email,
  name,
  phone,
}) => {
  const { trackEvent } = useTracking()

  const formik = useFormik<RequestForPriceEstimateFormikSchema>({
    validateOnChange: true,
    initialValues: {
      requesterEmail: email,
      requesterName: name,
      requesterPhoneNumber: phone,
    },
    onSubmit: async ({ requesterEmail, requesterName, requesterPhoneNumber }) => {
      const input = { artworkId: artworkID, requesterEmail, requesterName, requesterPhoneNumber }
      const onCompleted = (response: RequestForPriceEstimateScreenMutation["response"]) => {
        const myCollectionArtworkId =
          response.requestPriceEstimate?.priceEstimateParamsOrError?.submittedPriceEstimateParams
            ?.artworkId
        if (myCollectionArtworkId) {
          GlobalStore.actions.requestedPriceEstimates.addRequestedPriceEstimate({
            artworkId: myCollectionArtworkId,
            requestedAt: new Date().getTime(),
          })
          Toast.show(
            "Request Sent. \nAn Artsy Specialist will contact you with a response",
            "top",
            {
              backgroundColor: "blue100",
              duration: "long",
            }
          )
          trackEvent(
            tracks.sentRequestPriceEstimate(
              myCollectionArtworkId,
              artworkSlug,
              demandRank ?? undefined
            )
          )
          goBack()
        }
      }
      const onError = () => {
        Toast.show("Error: Failed to send a price estimate request.", "top", {
          backgroundColor: "red100",
        })
      }
      requestForPriceEstimateMutation(defaultEnvironment, onCompleted, onError, input)
    },
    validationSchema: ValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isVisible: true, isPresentedModally: false, bottomOffset: 10 }}
      >
        <RequestForPriceEstimateForm />
      </ArtsyKeyboardAvoidingViewContext.Provider>
    </FormikProvider>
  )
}

const tracks = {
  sentRequestPriceEstimate: (
    artworkId: string,
    artworkSlug: string,
    demandRank?: number
  ): SentRequestPriceEstimate => ({
    action: ActionType.sentRequestPriceEstimate,
    context_module: ContextModule.myCollectionArtworkInsights,
    context_screen: OwnerType.myCollectionArtworkInsights,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    context_screen_owner_id: artworkId,
    context_screen_owner_slug: artworkSlug,
    demand_index: demandRank,
  }),
}
