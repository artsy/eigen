import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AlertIcon, BorderBox, Button, Flex, Text } from "palette"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Image } from "react-native-svg"

import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { CollapsibleArtworkDetails } from "lib/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface MakeOfferModalProps {
  // closeModal?: () => void
  // exitModal?: () => void
  toggleVisibility: () => void
  modalIsVisible: boolean
  // item: MakeOfferModal_item
  artwork: MakeOfferModal_artwork
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ ...props }) => {
  const { toggleVisibility, modalIsVisible, artwork } = props

  return (
    <FancyModal visible={modalIsVisible} onBackgroundPressed={() => {}}>
      <FancyModalHeader
        onLeftButtonPress={() => {
          toggleVisibility()
        }}
        leftButtonText="Cancel"
        rightButtonDisabled
        rightButtonText=""
        onRightButtonPress={() => {}}
        hideBottomDivider
      ></FancyModalHeader>
      <Flex p={1.5}>
        <Text variant="largeTitle">Confirm Artwork</Text>
        <Text variant="small" color="black60">
          {" "}
          Make sure the artwork below matches the intended work you're making an offer on.
        </Text>
        <CollapsibleArtworkDetails artwork={artwork} />
        <Button size="large" variant="primaryBlack" block width={100} mb={1}>
          Confirm
        </Button>
        <Button size="large" variant="secondaryOutline" block width={100}>
          Cancel
        </Button>
      </Flex>
    </FancyModal>
  )
}

export const MakeOfferModalFragmentContainer = createFragmentContainer(MakeOfferModal, {
  artwork: graphql`
    fragment MakeOfferModal_artwork on Artwork {
      editionSets {
        id
        internalID
        saleMessage
        editionOf

        dimensions {
          in
          cm
        }
      }
    }
  `,
})

// export const MakeOfferModalFragmentContainer = createFragmentContainer(MakeOfferModal, {
//   item: graphql`
//     fragment MakeOfferModal_item on ConversationItemType {
//       __typename
//       ... on Artwork {
//         href
//         image {
//           thumbnailUrl: url(version: "small")
//         }
//         title
//         artistNames
//       }
//     }
//   `,
// })
