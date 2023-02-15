import { Flex, FlexProps } from "@artsy/palette-mobile"
import { ArtworkPrice_artwork$key } from "__generated__/ArtworkPrice_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkAuctionBidInfo } from "./ArtworkAuctionBidInfo"

interface ArtworkPriceProps extends FlexProps {
  artwork: ArtworkPrice_artwork$key
}

export const ArtworkPrice: React.FC<ArtworkPriceProps> = ({ artwork, ...flexProps }) => {
  const data = useFragment(artworkPriceFragment, artwork)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const editionSets = data.editionSets ?? []
  let message = null

  const getEditionSetMessage = () => {
    const selectedEdition = editionSets.find((editionSet) => {
      return editionSet?.internalID === selectedEditionId
    })

    return selectedEdition?.saleMessage
  }

  const renderShippingAndTaxesInfo = () => {
    if (!data.isEligibleForOnPlatformTransaction || data.isInAuction || data.isPriceHidden) {
      return null
    }

    return (
      <Text variant="xs" color="black60">
        excl. Shipping and Taxes
      </Text>
    )
  }

  if (data.isInAuction) {
    if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      return null
    }

    return <ArtworkAuctionBidInfo artwork={data} {...flexProps} />
  }

  if (editionSets.length > 1) {
    message = getEditionSetMessage()
  } else {
    message = data.saleMessage
  }

  if (message) {
    return (
      <Flex {...flexProps}>
        <Text variant="lg-display">{message}</Text>
        {renderShippingAndTaxesInfo()}
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
    isEligibleForOnPlatformTransaction
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
