import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { CloseIcon } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"

interface InquiryModalProps {
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = props => {
  const { toggleVisibility, modalIsVisible } = props

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <CloseIcon onPress={() => toggleVisibility()} />
    </FancyModal>
  )
}
