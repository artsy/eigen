import { InquiryModal_artwork } from "__generated__/InquiryModal_artwork.graphql"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Flex, Text } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { createFragmentContainer, graphql } from "react-relay"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"

interface InquiryModalProps {
  artwork: InquiryModal_artwork
  closeModal?: () => void
  exitModal?: () => void
  toggleVisibility: () => void
  navigator?: NavigatorIOS
  modalIsVisible: boolean
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ artwork, ...props }) => {
  const { toggleVisibility, modalIsVisible } = props

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => toggleVisibility()}>
      <FancyModalHeader leftButtonText="Cancel" onLeftButtonPress={() => toggleVisibility()}>
        Contact Gallery
      </FancyModalHeader>
      <CollapsibleArtworkDetailsFragmentContainer artwork={artwork} />
      <Flex bg="white100" flex={1}>
        <Text m={2} variant="title">
          More here
        </Text>
      </Flex>
    </FancyModal>
  )
}

export const InquiryModalFragmentContainer = createFragmentContainer(InquiryModal, {
  artwork: graphql`
    fragment InquiryModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
    }
  `,
})
