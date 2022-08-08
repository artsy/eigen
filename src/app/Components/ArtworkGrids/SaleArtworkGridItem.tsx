import { ScreenOwnerType, tappedMainArtworkGrid } from "@artsy/cohesion"
import { SaleArtworkGridItem_saleArtwork$data } from "__generated__/SaleArtworkGridItem_saleArtwork.graphql"
import { filterArtworksParams } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  RandomNumberGenerator,
} from "app/utils/placeholders"
import { Box, Flex, Spacer, Text, Touchable } from "palette"
import { StyleSheet, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { navigate } from "../../navigation/navigate"
import { saleMessageOrBidInfo } from "./ArtworkGridItem"

export interface ArtworkProps {
  saleArtwork: SaleArtworkGridItem_saleArtwork$data
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

export const SaleArtworkGridItem: React.FC<ArtworkProps> = ({
  saleArtwork,
  onPress,
  trackTap,
  itemIndex,
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  contextScreenOwnerType,
}) => {
  const tracking = useTracking()

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterParams = filterArtworksParams(appliedFilters)

  const artwork = saleArtwork.artwork!

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

  const saleInfo = saleMessageOrBidInfo({
    artwork: {
      sale: saleArtwork.sale,
      saleArtwork,
      saleMessage: saleArtwork.artwork?.saleMessage || null,
      realizedPrice: artwork.realizedPrice,
    },
  })

  return (
    <Touchable onPress={() => handleTap()}>
      <View>
        {!!artwork.image && (
          <OpaqueImageView
            aspectRatio={artwork.image?.aspectRatio ?? 1}
            imageURL={artwork.image?.url}
            style={styles.artworkImage}
          />
        )}
        <Box mt={1}>
          {!!saleArtwork?.lotLabel && (
            <Text variant="sm" color="black60" numberOfLines={1}>
              Lot {saleArtwork.lotLabel}
            </Text>
          )}
          {!!artwork.artistNames && (
            <Text variant="sm" weight="medium" numberOfLines={1}>
              {artwork.artistNames}
            </Text>
          )}
          {!!artwork.title && (
            <Text variant="sm" color="black60" numberOfLines={1}>
              {artwork.title}
              {!!artwork.date && `, ${artwork.date}`}
            </Text>
          )}
          {!!saleInfo && (
            <Text variant="sm" color="black60" numberOfLines={1}>
              {saleInfo}
            </Text>
          )}
        </Box>
      </View>
    </Touchable>
  )
}

const styles = StyleSheet.create({
  artworkImage: {
    justifyContent: "flex-end",
    paddingHorizontal: 5,
    paddingBottom: 5,
  },

  endingDateContainer: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingHorizontal: 5,
    minWidth: 100,
    paddingVertical: 3,
  },
})

export const SaleArtworkGridItemPlaceholder: React.FC<{ seed?: number }> = ({
  seed = Math.random(),
}) => {
  const rng = new RandomNumberGenerator(seed)
  return (
    <Flex>
      <PlaceholderBox height={rng.next({ from: 50, to: 150 })} width="100%" />
      <Spacer mb="1" />
      <PlaceholderRaggedText seed={rng.next()} numLines={2} />
    </Flex>
  )
}

export const SaleArtworkGridItemContainer = createFragmentContainer(SaleArtworkGridItem, {
  saleArtwork: graphql`
    fragment SaleArtworkGridItem_saleArtwork on SaleArtwork {
      artwork {
        internalID
        title
        date
        saleMessage
        slug
        artistNames
        href
        image {
          url(version: "large")
          aspectRatio
        }
        realizedPrice
      }
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      lotLabel
      sale {
        isAuction
        isClosed
        displayTimelyAt
      }
    }
  `,
})
