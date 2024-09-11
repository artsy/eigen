import { Box, Flex, FlexProps, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkPrice_artwork$key } from "__generated__/ArtworkPrice_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { ExpiresInTimer } from "app/Scenes/Artwork/Components/ExpiresInTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { graphql, useFragment } from "react-relay"
import { ArtworkAuctionBidInfo } from "./ArtworkAuctionBidInfo"

interface ArtworkPriceProps extends FlexProps {
  artwork: ArtworkPrice_artwork$key
}

export const ArtworkPrice: React.FC<ArtworkPriceProps> = ({ artwork, ...flexProps }) => {
  const artworkData = useFragment(artworkPriceFragment, artwork)
  const partnerOfferData = artworkData.collectorSignals?.partnerOffer
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const editionSets = artworkData.editionSets ?? []
  let message = null

  const AREnablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")

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

  if (
    !!AREnablePartnerOfferOnArtworkScreen &&
    partnerOfferData &&
    artworkData.collectorSignals?.primaryLabel === "PARTNER_OFFER"
  ) {
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

          <ExpiresInTimer endAt={partnerOfferData.endAt} />
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" mt={1} alignItems="flex-end">
          <Text variant="lg-display" mr={1}>
            {partnerOfferData.priceWithDiscount?.display}
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
    collectorSignals {
      primaryLabel
      partnerOffer {
        endAt
        isAvailable
        isActive
        priceWithDiscount {
          display
        }
      }
    }
    ...ArtworkAuctionBidInfo_artwork
  }
`
