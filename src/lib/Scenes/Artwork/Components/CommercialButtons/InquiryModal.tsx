import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Text } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { ArtworkDetails } from "./ArtworkDetails"

interface InquiryModalProps {
  artwork?: {}
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = (props) => {
  const { toggleVisibility, modalIsVisible } = props

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => toggleVisibility()}>
        Contact Gallery
      </FancyModalHeader>
      <ArtworkDetails artwork={props.artwork} />
      <Text m={2} variant="title">
        More here
      </Text>
    </FancyModal>
  )
}
