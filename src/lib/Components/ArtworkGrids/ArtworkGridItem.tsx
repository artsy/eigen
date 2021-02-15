import { ScreenOwnerType, tappedMainArtworkGrid } from "@artsy/cohesion"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { getUrgencyTag } from "lib/utils/getUrgencyTag"
import { PlaceholderBox, PlaceholderRaggedText, RandomNumberGenerator } from "lib/utils/placeholders"
import { Box, Flex, Sans, Spacer } from "palette"
import { Touchable } from "palette"
import React, { useContext, useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ArtworkProps {
  artwork: ArtworkGridItem_artwork
  // If it's not provided, then it will push just the one artwork
  // to the switchboard.
  onPress?: (artworkID: string) => void
  trackingFlow?: string
  contextModule?: string
  // Pass Tap to override generic ing, used for home tracking in rails
  trackTap?: (artworkSlug: string, index?: number) => void
  itemIndex?: number
  // By default, we don't track clicks from the grid unless you pass in a contextScreenOwnerType.
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  // Hide urgency tags (3 Days left, 1 hour left)
  hideUrgencyTags?: boolean
  // Hide partner name
  hidePartner?: boolean
  // Show the lot number (Lot 213)
  showLotLabel?: boolean
}

export const Artwork: React.FC<ArtworkProps> = ({
  artwork,
  onPress,
  trackTap,
  itemIndex,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
  hideUrgencyTags = false,
  hidePartner = false,
  showLotLabel = false,
}) => {
  const itemRef = useRef<any>()
  const tracking = useTracking()

  const filterContext = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(filterContext?.state?.appliedFilters)

  const handleTap = () => {
    trackArtworkTap()
    onPress && artwork.slug ? onPress(artwork.slug) : navigate(artwork.href!)
  }

  const trackArtworkTap = () => {
    // Unless you explicitly pass in a tracking function or provide a contextScreenOwnerType, we won't track
    // taps from the grid.
    if (trackTap || contextScreenOwnerType) {
      const genericTapEvent = tappedMainArtworkGrid({
        contextScreenOwnerType: contextScreenOwnerType!,
        contextScreenOwnerId,
        contextScreenOwnerSlug,
        destinationScreenOwnerId: artwork.internalID,
        destinationScreenOwnerSlug: artwork.slug,
        position: itemIndex,
        // This is always a string; types are incorrect
        sort: String(filterParams?.sort),
      })

      trackTap ? trackTap(artwork.slug, itemIndex) : tracking.trackEvent(genericTapEvent)
    }
  }

  const saleInfo = saleMessageOrBidInfo({ artwork })

  const urgencyTag = getUrgencyTag(artwork?.sale?.endAt)

  return (
    <Touchable onPress={() => handleTap()}>
      <View ref={itemRef}>
        {!!artwork.image && (
          <View>
            <OpaqueImageView aspectRatio={artwork.image?.aspectRatio ?? 1} imageURL={artwork.image?.url} />
            {Boolean(!hideUrgencyTags && urgencyTag && artwork?.sale?.isAuction && !artwork?.sale?.isClosed) && (
              <Flex
                position="absolute"
                bottom="5"
                left={5}
                backgroundColor="white"
                px="5"
                py="3"
                borderRadius={2}
                alignSelf="flex-start"
              >
                <Sans size="2" color="black100" numberOfLines={1}>
                  {urgencyTag}
                </Sans>
              </Flex>
            )}
          </View>
        )}
        <Box mt="1">
          {!!showLotLabel && !!artwork.saleArtwork?.lotLabel && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              Lot {artwork.saleArtwork.lotLabel}
            </Sans>
          )}
          {!!artwork.artistNames && (
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {artwork.artistNames}
            </Sans>
          )}
          {!!artwork.title && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Sans>
          )}
          {!hidePartner && !!artwork.partner?.name && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              {artwork.partner.name}
            </Sans>
          )}
          {!!saleInfo && (
            <Sans color="black60" size="3t" numberOfLines={1}>
              {saleInfo}
            </Sans>
          )}
        </Box>
      </View>
    </Touchable>
  )
}

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
}: {
  artwork: Readonly<{
    sale: { isAuction: boolean | null; isClosed: boolean | null } | null
    saleArtwork: {
      counts: { bidderPositions: number | null } | null | null
      currentBid: { display: string | null } | null
    } | null
    saleMessage: string | null
  }>
  isSmallTile?: boolean
}): string | null | undefined => {
  const { sale, saleArtwork } = artwork

  // Auction specs are available at https://artsyproduct.atlassian.net/browse/MX-482
  if (sale?.isAuction) {
    // The auction is closed
    if (sale.isClosed) {
      return "Bidding closed"
    }

    // The auction is open
    const bidderPositions = saleArtwork?.counts?.bidderPositions
    const currentBid = saleArtwork?.currentBid?.display
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

  if (artwork.saleMessage === "Contact For Price") {
    return "Contact for price"
  }

  return artwork.saleMessage
}

export default createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment ArtworkGridItem_artwork on Artwork {
      title
      date
      saleMessage
      slug
      internalID
      artistNames
      href
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        lotLabel
      }
      partner {
        name
      }
      image {
        url(version: "large")
        aspectRatio
      }
    }
  `,
})

export const ArtworkGridItemPlaceholder: React.FC<{ seed?: number }> = ({ seed = Math.random() }) => {
  const rng = new RandomNumberGenerator(seed)
  return (
    <Flex>
      <PlaceholderBox height={rng.next({ from: 50, to: 150 })} width="100%" />
      <Spacer mb="1" />
      <PlaceholderRaggedText seed={rng.next()} numLines={2} />
    </Flex>
  )
}
