import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { SentConsignmentInquiry } from "@artsy/cohesion/dist/Schema/Events/Consignments"
import { useNavigation } from "@react-navigation/native"
import { ConsignmentInquiryScreenMutation } from "__generated__/ConsignmentInquiryScreenMutation.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { FormikProvider, useFormik } from "formik"
import { CloseIcon } from "palette"
import { useEffect, useState } from "react"
import { useTracking } from "react-tracking"
import { commitMutation, Environment, graphql } from "relay-runtime"
import { ArtsyKeyboardAvoidingViewContext } from "shared/utils"
import * as Yup from "yup"
import { ConsignmentInquiryConfirmation } from "./ConsignmentInquiryConfirmation"
import { ConsignmentInquiryForm } from "./ConsignmentInquiryForm"
import { ConsignmentInquiryFormAbandonEdit } from "./ConsignmentInquiryFormAbandonEdit"

interface InquiryScreenProps {
  name: string
  email: string
  phone: string
  userId?: string
}

export interface InquiryFormikSchema {
  name: string
  email: string
  phoneNumber: string
  message: string
}

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name field is required").min(1, "Name field is required"),
  email: Yup.string()
    .required("Email field is required")
    .email("Please provide a valid email address"),
  message: Yup.string().required("An inquiry message is required"),
})

export const createConsignmentInquiry = (
  environment: Environment,
  onCompleted: (response: ConsignmentInquiryScreenMutation["response"]) => void,
  onError: () => void,
  input: InquiryFormikSchema & { userId?: string }
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
}) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const [showConfirmedModal, setShowConfirmedModal] = useState(false)
  const navigation = useNavigation()
  const { trackEvent } = useTracking()
  const toast = useToast()

  useEffect(() => {
    const backListener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault()
      if (showAbandonModal || showConfirmedModal) {
        navigation.dispatch(e.data.action)
        return
      }
      setShowAbandonModal(true)
    })
    return backListener
  }, [navigation])

  const formik = useFormik<InquiryFormikSchema>({
    validateOnChange: true,
    initialValues: {
      email,
      name,
      phoneNumber: phone,
      message: "",
    },
    // tslint:disable-next-line:no-shadowed-variable
    onSubmit: async ({ email, name, phoneNumber, message }) => {
      const input = { email, name, phoneNumber, message, userId }
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

      createConsignmentInquiry(defaultEnvironment, onCompleted, onError, input)
    },
    validationSchema: ValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isVisible: true, isPresentedModally: false, bottomOffset: 10 }}
      >
        <ConsignmentInquiryForm />
        <FancyModal visible={showAbandonModal && !showConfirmedModal}>
          <FancyModalHeader
            hideBottomDivider
            renderRightButton={() => <CloseIcon width={26} height={26} />}
            onRightButtonPress={() => {
              setShowAbandonModal(false)
            }}
          />
          <ConsignmentInquiryFormAbandonEdit
            onDismiss={() => {
              setShowAbandonModal(false)
            }}
          />
        </FancyModal>
        <FancyModal
          fullScreen
          visible={showConfirmedModal && !showAbandonModal}
          animationPosition="right"
        >
          <ConsignmentInquiryConfirmation />
        </FancyModal>
      </ArtsyKeyboardAvoidingViewContext.Provider>
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
