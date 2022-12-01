import { useNavigation } from "@react-navigation/native"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { FormikProvider, useFormik } from "formik"
import { CloseIcon } from "palette"
import { useEffect, useState } from "react"
import { ArtsyKeyboardAvoidingViewContext } from "shared/utils"
import * as Yup from "yup"
import { InquiryForm } from "./InquiryForm"
import { InquiryFormAbandonEdit } from "./InquiryFormAbandonEdit"
import { SWAInquiryConfirmation } from "./SWAInquiryConfirmation"

interface InquiryScreenProps {
  name: string
  email: string
  phone: string
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

export const SWAInquiryScreen: React.FC<InquiryScreenProps> = ({ email, name, phone }) => {
  const [showAbandonModal, setShowAbandonModal] = useState(false)
  const [showConfirmedModal, setShowConfirmedModal] = useState(false)
  const navigation = useNavigation()

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
    onSubmit: () => {
      // TODO:
      // trackEvent(tracks.sentSWAInquiry())
      setShowConfirmedModal(true)
    },
    validationSchema: ValidationSchema,
  })

  return (
    <FormikProvider value={formik}>
      <ArtsyKeyboardAvoidingViewContext.Provider
        value={{ isVisible: true, isPresentedModally: false, bottomOffset: 10 }}
      >
        <InquiryForm />
        <FancyModal visible={showAbandonModal && !showConfirmedModal}>
          <FancyModalHeader
            hideBottomDivider
            renderRightButton={() => <CloseIcon width={26} height={26} />}
            onRightButtonPress={() => {
              setShowAbandonModal(false)
            }}
          />
          <InquiryFormAbandonEdit
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
          <SWAInquiryConfirmation />
        </FancyModal>
      </ArtsyKeyboardAvoidingViewContext.Provider>
    </FormikProvider>
  )
}
