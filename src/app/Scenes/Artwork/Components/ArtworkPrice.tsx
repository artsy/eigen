import { Box, Flex, FlexProps, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkPrice_artwork$key } from "__generated__/ArtworkPrice_artwork.graphql"
import { ArtworkPrice_me$key } from "__generated__/ArtworkPrice_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { ExpiresInTimer } from "app/Scenes/Artwork/Components/ExpiresInTimer"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"
import { ArtworkAuctionBidInfo } from "./ArtworkAuctionBidInfo"

interface ArtworkPriceProps extends FlexProps {
  artwork: ArtworkPrice_artwork$key
  me: ArtworkPrice_me$key
}

export const ArtworkPrice: React.FC<ArtworkPriceProps> = ({ artwork, me, ...flexProps }) => {
  const artworkData = useFragment(artworkPriceFragment, artwork)
  const meData = useFragment(mePriceFragment, me)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const editionSets = artworkData.editionSets ?? []
  let message = null

  const AREnablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")

  const partnerOffer =
    (!!AREnablePartnerOfferOnArtworkScreen &&
      meData.partnerOffersConnection &&
      extractNodes(meData.partnerOffersConnection)[0]) ||
    null

  const getEditionSetMessage = () => {
    const selectedEdition = editionSets.find((editionSet) => {
      return editionSet?.internalID === selectedEditionId
    })

    return selectedEdition?.saleMessage
  }

  if (artworkData.isInAuction) {
    if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      return null
    }

    return <ArtworkAuctionBidInfo artwork={artworkData} {...flexProps} />
  }

  if (editionSets.length > 1) {
    message = getEditionSetMessage()
  } else {
    message = artworkData.saleMessage
  }

  if (!!partnerOffer && partnerOffer.isAvailable) {
    const listPrice = artworkData.isPriceHidden ? "Not publicly listed" : message

    return (
      <Flex {...flexProps}>
        <Flex flexDirection="row">
          <Box borderRadius={3} backgroundColor="blue10" px={0.5} pb="2px">
            <Text variant="xs" color="blue100">
              Limited-Time Offer
            </Text>
          </Box>

          <Spacer x={1} />

          <ExpiresInTimer item={partnerOffer} />
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" mt={1} alignItems="flex-end">
          <Text variant="lg-display" mr={1}>
            {partnerOffer.priceWithDiscount?.display}
          </Text>

          <Text variant="xs" color="black60">
            (List Price: {listPrice})
          </Text>
        </Flex>
      </Flex>
    )
  }

  if (message) {
    return (
      <Flex {...flexProps}>
        <Text variant="lg-display">{message}</Text>
      </Flex>
    )
  }

  return null
}

const artworkPriceFragment = graphql`
  fragment ArtworkPrice_artwork on Artwork {
    saleMessage
    availability
    isInAuction
    isPriceHidden
    taxInfo {
      displayText
    }
    editionSets {
      internalID
      saleMessage
    }
    ...ArtworkAuctionBidInfo_artwork
  }
`

const mePriceFragment = graphql`
  fragment ArtworkPrice_me on Me @argumentDefinitions(artworkID: { type: "String!" }) {
    partnerOffersConnection(artworkID: $artworkID, first: 1) {
      edges {
        node {
          endAt
          internalID
          isAvailable
          priceWithDiscount {
            display
          }
        }
      }
    }
  }
`
