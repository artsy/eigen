import { ScreenOwnerType, tappedMainArtworkGrid } from "@artsy/cohesion"
import { Box, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderRaggedText, RandomNumberGenerator } from "lib/utils/placeholders"
import { Touchable } from "palette"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
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
}

export const Artwork: React.FC<Props> = props => {
  const itemRef = useRef<any>()
  const tracking = useTracking()

  const handleTap = () => {
    trackArtworkTap()
    props.onPress && props.artwork.slug
      ? props.onPress(props.artwork.slug)
      : SwitchBoard.presentNavigationViewController(
          itemRef.current!,
          // @ts-ignore STRICTNESS_MIGRATION
          props.artwork.href
        )
  }

  const trackArtworkTap = () => {
    const { trackTap, contextScreenOwnerId, contextScreenOwnerSlug, contextScreenOwnerType } = props

    // Unless you explicitly pass in a tracking function or provide a contextScreenOwnerType, we won't track
    // taps from the grid.
    if (trackTap || contextScreenOwnerType) {
      const genericTapEvent = tappedMainArtworkGrid({
        contextScreenOwnerType: contextScreenOwnerType!,
        contextScreenOwnerId,
        contextScreenOwnerSlug,
        destinationScreenOwnerId: artwork.internalID,
        destinationScreenOwnerSlug: artwork.slug,
      })

      trackTap ? trackTap(props.artwork.slug, props.itemIndex) : tracking.trackEvent(genericTapEvent)
    }
  }

  const artwork = props.artwork
  const artworkImage = artwork.image
  const saleInfo = saleMessageOrBidInfo(artwork)

  return (
    <Touchable onPress={() => handleTap()}>
      <View ref={itemRef}>
        {!!artworkImage && (
          <OpaqueImageView aspectRatio={artwork.image?.aspectRatio ?? 1} imageURL={artwork.image?.url} />
        )}
        <Box mt={1}>
          {!!props.artwork.artistNames && (
            <Sans size="3t" weight="medium" numberOfLines={1}>
              {props.artwork.artistNames}
            </Sans>
          )}
          {!!artwork.title && (
            <Sans size="3t" color="black60" numberOfLines={1}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Sans>
          )}
          {!!artwork.partner?.name && (
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

export const saleMessageOrBidInfo = (
  artwork: Readonly<{
    sale: { isAuction: boolean | null; isClosed: boolean | null } | null
    saleArtwork: { currentBid: { display: string | null } | null } | null
    saleMessage: string | null
  }>
): string | null | undefined => {
  const { sale, saleArtwork } = artwork
  const inRunningAuction = sale && sale.isAuction && !sale.isClosed
  const inClosedAuction = sale && sale.isAuction && sale.isClosed

  if (inClosedAuction) {
    return "Bidding closed"
  } else if (inRunningAuction) {
    return saleArtwork?.currentBid?.display
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
      }
      saleArtwork {
        currentBid {
          display
        }
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
