import { ArtworkPrice_artwork$key } from "__generated__/ArtworkPrice_artwork.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { capitalize } from "lodash"
import { Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkStore } from "../ArtworkStore"
import { ArtworkAuctionBidInfo } from "./ArtworkAuctionBidInfo"

interface ArtworkPriceProps {
  artwork: ArtworkPrice_artwork$key
}

export const ArtworkPrice: React.FC<ArtworkPriceProps> = ({ artwork }) => {
  const data = useFragment(artworkPriceFragment, artwork)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const editionSets = data.editionSets ?? []
  let message = null

  const getMessage = () => {
    if (data.saleMessage) {
      return data.saleMessage
    }

    if (data.availability) {
      return capitalize(data.availability)
    }

    return
  }

  const getEditionSetMessage = () => {
    const selectedEdition = editionSets.find((editionSet) => {
      return editionSet?.internalID === selectedEditionId
    })

    return selectedEdition?.saleMessage
  }

  const renderShippingAndTaxesInfo = () => {
    if (!data.isEligibleForOnPlatformTransaction || data.isInAuction) {
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

    return <ArtworkAuctionBidInfo artwork={data} />
  }

  if (editionSets.length > 1) {
    message = getEditionSetMessage()
  } else {
    message = getMessage()
  }

  if (message) {
    return (
      <>
        <Text variant="lg-display">{message}</Text>
        {renderShippingAndTaxesInfo()}
      </>
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
