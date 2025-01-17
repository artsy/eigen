import { ContextModule, OwnerType, tappedEntityGroup, TappedEntityGroupArgs } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ListRenderItem } from "@shopify/flash-list"
import {
  SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data,
  SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key,
} from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { ArtworkRailProps } from "app/Components/ArtworkRail/ArtworkRail"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { PrefetchFlashList } from "app/Components/PrefetchFlashList"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { compact } from "lodash"
import { useCallback } from "react"
import { PixelRatio } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MAX_NUMBER_OF_ARTWORKS = 30
const fontScale = PixelRatio.getFontScale()

interface SellWithArtsyRecentlySoldProps {
  recentlySoldArtworks: SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$key
}

const trackingArgs: TappedEntityGroupArgs = {
  contextModule: ContextModule.artworkRecentlySoldGrid,
  contextScreenOwnerType: OwnerType.sell,
  destinationScreenOwnerType: OwnerType.artwork,
  type: "thumbnail",
}

export const SellWithArtsyRecentlySold: React.FC<SellWithArtsyRecentlySoldProps> = ({
  recentlySoldArtworks,
}) => {
  const tracking = useTracking()
  const recentlySoldArtworksData = useFragment(
    customRecentlySoldArtworksFragment,
    recentlySoldArtworks
  )

  const recentlySoldArtworksNodes = extractNodes(recentlySoldArtworksData)

  return (
    <Flex>
      <Text px={2} variant="lg-display">
        Previously sold on Artsy
      </Text>

      <Spacer y={2} />

      <RecentlySoldArtworksRail
        recentlySoldArtworks={recentlySoldArtworksNodes}
        onPress={(recentlySoldArtwork) => {
          tracking.trackEvent(
            tappedEntityGroup({
              ...trackingArgs,
              destinationScreenOwnerId: recentlySoldArtwork?.artwork?.internalID,
              destinationScreenOwnerSlug: recentlySoldArtwork?.artwork?.slug,
            })
          )
        }}
        showPartnerName={false}
      />
    </Flex>
  )
}

type RecentlySoldArtwork =
  ExtractNodeType<SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data>

export interface RecentlySoldArtworksRailProps
  extends Omit<ArtworkRailProps, "artworks" | "onPress"> {
  recentlySoldArtworks: RecentlySoldArtwork[]
  onPress?: (recentlySoldArtwork: RecentlySoldArtwork, index: number) => void
}

const RecentlySoldArtworksRail: React.FC<RecentlySoldArtworksRailProps> = ({
  listRef,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = <Spacer x={2} />,
  ListFooterComponent = <Spacer x={2} />,
  hideArtistName = false,
  recentlySoldArtworks,
  showPartnerName = true,
}) => {
  const renderItem: ListRenderItem<RecentlySoldArtwork> = useCallback(
    ({ item, index }) => {
      if (!item?.artwork) {
        return null
      }

      return (
        <ArtworkRailCard
          artwork={item.artwork}
          onPress={() => {
            onPress?.(item, index)
          }}
          // 102 = 92px (text container height) + 10px (padding)
          // 20px is the height of a second line of the Estimate price when displayed in two lines
          containerHeight={ARTWORK_RAIL_CARD_IMAGE_HEIGHT + fontScale * (102 + 20)}
          showPartnerName={showPartnerName}
          SalePriceComponent={
            <RecentlySoldCardSection
              priceRealizedDisplay={item?.priceRealized?.display || ""}
              lowEstimateDisplay={item?.lowEstimate?.display || ""}
              highEstimateDisplay={item?.highEstimate?.display || ""}
              performanceDisplay={item?.performance?.mid ?? undefined}
            />
          }
          hideArtistName={hideArtistName}
        />
      )
    },
    [hideArtistName, onPress, showPartnerName]
  )
  return (
    <PrefetchFlashList
      // We need to set the maximum number of artworks to not cause layout shifts
      data={recentlySoldArtworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      estimatedItemSize={ARTWORK_RAIL_CARD_MIN_WIDTH}
      horizontal
      keyExtractor={(item, index) => String(item?.artwork?.slug || index)}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      listRef={listRef}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  )
}

interface RecentlySoldCardSectionProps {
  priceRealizedDisplay: string
  lowEstimateDisplay: string
  highEstimateDisplay: string
  performanceDisplay?: string
}

const RecentlySoldCardSection: React.FC<RecentlySoldCardSectionProps> = ({
  priceRealizedDisplay,
  lowEstimateDisplay,
  highEstimateDisplay,
  performanceDisplay,
}) => {
  const priceFontSize = fontScale > 1 ? "sm" : "md"

  return (
    <Flex>
      <Flex flexDirection="row">
        <Text variant={priceFontSize} numberOfLines={1}>
          {priceRealizedDisplay}
        </Text>
        {!!performanceDisplay && (
          <Text variant={priceFontSize} color="green" numberOfLines={1} ml={0.5}>
            {`+${performanceDisplay}`}
          </Text>
        )}
      </Flex>
      <Text variant="xs" color="black60">
        Estimate {compact([lowEstimateDisplay, highEstimateDisplay]).join("—")}
      </Text>
    </Flex>
  )
}

const customRecentlySoldArtworksFragment = graphql`
  fragment SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection on RecentlySoldArtworkTypeConnection {
    edges {
      node {
        artwork {
          ...ArtworkRailCard_artwork
          internalID
          href
          slug
        }
        lowEstimate {
          display
        }
        highEstimate {
          display
        }
        priceRealized {
          display
        }
        performance {
          mid
        }
      }
    }
  }
`
