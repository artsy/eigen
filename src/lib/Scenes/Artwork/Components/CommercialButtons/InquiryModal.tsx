import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { CloseIcon, Sans } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { MyCollectionAddArtwork } from "../Screens/MyCollectionAddArtwork/MyCollectionAddArtwork"
import { useStoreActions, useStoreState } from "../State/hooks"

interface InquiryModalProps {
  closeModal?: () => void
  exitModal?: () => void
  setModalVisibility: () => void
  navigator?: NavigatorIOS
  modalVisibility: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = props => {
  // state = {
  //   isArtworkGridVisible: false,
  //   isFilterArtworksModalVisible: false,
  // }
  const { closeModal, exitModal, setModalVisibility, modalVisibility } = props

  return (
    <FancyModal visible={!!modalVisibility} onBackgroundPressed={() => setModalVisibility()}>
      <Sans size="2">INQUIRY MODAL</Sans>
      <CloseIcon onPress={() => setModalVisibility()} />
    </FancyModal>
  )
}
