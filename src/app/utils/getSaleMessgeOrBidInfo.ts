import { ArtworkGridItem_artwork$data } from "__generated__/ArtworkGridItem_artwork.graphql"
import { DateTime } from "luxon"

type ArtworkSale =
  | Pick<NonNullable<ArtworkGridItem_artwork$data["sale"]>, "isAuction" | "isClosed">
  | null
  | undefined

type ArtworkSaleArtwork =
  | Pick<NonNullable<ArtworkGridItem_artwork$data["saleArtwork"]>, "counts" | "currentBid">
  | null
  | undefined

type Artwork = Pick<ArtworkGridItem_artwork$data, "saleMessage"> & {
  sale: ArtworkSale
  saleArtwork: ArtworkSaleArtwork
}
type collectorSignals = ArtworkGridItem_artwork$data["collectorSignals"]
type AuctionSignals = NonNullable<ArtworkGridItem_artwork$data["collectorSignals"]>["auction"]

/**
 * Get sale message or bid info
 * @example
 * "$1,000 (Starting price)"
 * @example
 * "Bidding closed"
 *  @example
 * "$1,750 (2 bids)"
 */
export const saleMessageOrBidInfo = ({
  artwork,
  isSmallTile = false,
  collectorSignals,
  auctionSignals,
}: {
  artwork: Artwork
  isSmallTile?: boolean
  collectorSignals?: collectorSignals
  auctionSignals?: AuctionSignals
}): string | null | undefined => {
  const { sale, saleArtwork } = artwork

  // Auction specs are available at https://artsyproduct.atlassian.net/browse/MX-482
  // The auction is open
  if (sale?.isAuction && !sale.isClosed) {
    const bidderPositions = saleArtwork?.counts?.bidderPositions
    const currentBid = saleArtwork?.currentBid?.display

    if (!!auctionSignals) {
      const lotEndAt = DateTime.fromISO(auctionSignals.lotClosesAt ?? "")
      const bidCount = auctionSignals.bidCount

      if (lotEndAt.diffNow().as("seconds") <= 0) {
        return "Bidding closed"
      }

      if (auctionSignals.liveBiddingStarted) {
        return "Bidding live now"
      }

      if (!!bidCount) {
        return `${currentBid} (${bidCount} bid${bidCount > 1 ? "s" : ""})`
      }

      return currentBid
    }

    // If there are no current bids we show the starting price with an indication that it's a new bid
    if (!bidderPositions) {
      if (isSmallTile) {
        return `${currentBid} (Bid)`
      }
      return `${currentBid} (Starting bid)`
    }

    // If there are bids we show the current bid price and the number of bids
    const numberOfBidsString = bidderPositions === 1 ? "1 bid" : `${bidderPositions} bids`
    return `${currentBid} (${numberOfBidsString})`
  }

  if (collectorSignals?.partnerOffer?.isAvailable) {
    // If there is a partnerOffer we have to show the message as a strikethrough
    // in order to not change the type of the returned value we mark the message with ~
    // and parse it in the parsedSaleMessage function to apply different styles to each part later
    const salePrice = artwork.saleMessage ? `~${artwork.saleMessage}~` : ""

    return `${collectorSignals.partnerOffer.priceWithDiscount?.display}${salePrice}`
  }

  return artwork.saleMessage
}

export const parsedSaleMessage = (saleMessage: string | null | undefined) => {
  // Split the sale message into parts to apply different styles to each part
  const parts = saleMessage && saleMessage.split(/(~.*?~)/)

  return { parts }
}

export const displayAsLinethrought = (part: string) => {
  return part.startsWith("~") && part.endsWith("~")
}
