import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { SentConsignmentInquiry } from "@artsy/cohesion/dist/Schema/Events/Consignments"
import { ConsignmentInquiryScreenMutation } from "__generated__/ConsignmentInquiryScreenMutation.graphql"
import { AbandonFlowModal } from "app/Components/AbandonFlowModal"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { ArtsyKeyboardAvoidingView } from "app/utils/ArtsyKeyboardAvoidingView"
import { FormikProvider, useFormik } from "formik"
import { useState } from "react"
import { Environment, graphql, commitMutation } from "react-relay"
import { useTracking } from "react-tracking"
import * as Yup from "yup"
import { ConsignmentInquiryConfirmation } from "./ConsignmentInquiryConfirmation"
import { ConsignmentInquiryForm } from "./ConsignmentInquiryForm"

interface InquiryScreenProps {
  name: string
  email: string
  phone: string
  userId?: string
  recipientEmail?: string
  recipientName?: string
}

export interface InquiryFormikSchema {
  name: string
  email: string
  phoneNumber: string
  message: string
}

const ValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name field is required").min(1, "Name field is required"),
  email: Yup.string()
    .required("Email field is required")
    .email("Please provide a valid email address"),
  message: Yup.string().required("An inquiry message is required"),
})

export const createConsignmentInquiry = (
  environment: Environment,
  onCompleted: (response: ConsignmentInquiryScreenMutation["response"]) => void,
  onError: () => void,
  input: InquiryFormikSchema & { userId?: string; recipientEmail?: string }
) => {
  commitMutation<ConsignmentInquiryScreenMutation>(environment, {
    mutation: graphql`
      mutation ConsignmentInquiryScreenMutation($input: CreateConsignmentInquiryMutationInput!) {
        createConsignmentInquiry(input: $input) {
          consignmentInquiryOrError {
            ... on ConsignmentInquiryMutationSuccess {
              consignmentInquiry {
                internalID
              }
            }
            ... on ConsignmentInquiryMutationFailure {
              mutationError {
                error
                message
                statusCode
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

export const ConsignmentInquiryScreen: React.FC<InquiryScreenProps> = ({
  email,
  name,
  phone,
  userId,
  recipientEmail,
  recipientName,
}) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const [showConfirmedModal, setShowConfirmedModal] = useState(false)
  const { trackEvent } = useTracking()
  const toast = useToast()

  const formik = useFormik<InquiryFormikSchema>({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      email,
      name,
      phoneNumber: phone,
      message: "",
    },

    onSubmit: async ({ email, name, phoneNumber, message }) => {
      const formattedNameValue = name.trim()

      const input = !!recipientEmail
        ? { email, name: formattedNameValue, phoneNumber, message, userId, recipientEmail }
        : { email, name: formattedNameValue, phoneNumber, message, userId }
      const onCompleted = (response: ConsignmentInquiryScreenMutation["response"]) => {
        const consignmentInquiryId =
          response.createConsignmentInquiry?.consignmentInquiryOrError?.consignmentInquiry
            ?.internalID
        const error =
          response.createConsignmentInquiry?.consignmentInquiryOrError?.mutationError?.message

        if (error) {
          toast.show(`Error: ${error}`, "top", { backgroundColor: "red100" })
          return
        }
        if (consignmentInquiryId) {
          trackEvent(tracks.sentConsignmentInquiry(consignmentInquiryId))
          setShowConfirmedModal(true)
        }
      }
      const onError = () => {
        toast.show("Error: Failed to send inquiry.", "top", {
          backgroundColor: "red100",
        })
      }

      createConsignmentInquiry(getRelayEnvironment(), onCompleted, onError, input)
    },
    validationSchema: ValidationSchema,
  })

  const canPopScreen = showAbandonModal || showConfirmedModal

  return (
    <FormikProvider value={formik}>
      <>
        <ArtsyKeyboardAvoidingView>
          <FancyModalHeader hideBottomDivider />

          <ConsignmentInquiryForm
            confirmLeaveEdit={(v) => setShowAbandonModal(v)}
            canPopScreen={canPopScreen}
            recipientName={recipientName}
          />
        </ArtsyKeyboardAvoidingView>

        <AbandonFlowModal
          isVisible={!!showAbandonModal && !showConfirmedModal}
          title="Leave without sending message?"
          subtitle="Your message to the Sell with Artsy specialists will not been sent."
          leaveButtonTitle="Leave Without Sending"
          continueButtonTitle="Continue Editing Message"
          onDismiss={() => setShowAbandonModal(false)}
          onLeave={goBack}
        />

        <FancyModal
          fullScreen
          visible={!!showConfirmedModal && !showAbandonModal}
          animationPosition="right"
        >
          <ConsignmentInquiryConfirmation />
        </FancyModal>
      </>
    </FormikProvider>
  )
}

const tracks = {
  sentConsignmentInquiry: (consignmentInquiryId: number): SentConsignmentInquiry => ({
    action: ActionType.sentConsignmentInquiry,
    context_module: ContextModule.consignmentInquiryForm,
    context_screen_owner_type: OwnerType.consignmentInquiry,
    context_screen: OwnerType.consignmentInquiry,
    consignment_inquiry_id: consignmentInquiryId,
  }),
}
