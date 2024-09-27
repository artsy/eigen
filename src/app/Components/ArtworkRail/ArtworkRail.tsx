import { Box, Flex, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { ListRenderItem } from "@shopify/flash-list"
import {
  ArtworkRail_artworks$data,
  ArtworkRail_artworks$key,
} from "__generated__/ArtworkRail_artworks.graphql"
import {
  ARTWORK_RAIL_CARD_MINIMUM_WIDTH,
  ArtworkRailCard,
} from "app/Components/ArtworkRail/ArtworkRailCard"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_MIN_IMAGE_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { PrefetchFlashList } from "app/Components/PrefetchFlashList"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { RandomWidthPlaceholderText, useMemoizedRandom } from "app/utils/placeholders"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import { times } from "lodash"
import React, { ReactElement, useCallback } from "react"
import { FlatList, ViewabilityConfig } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

export const INITIAL_NUM_TO_RENDER = isTablet() ? 10 : 5
export const ARTWORK_RAIL_IMAGE_WIDTH = 295 // here

type Artwork = ArtworkRail_artworks$data[0]

export interface ArtworkRailProps extends ArtworkActionTrackingProps {
  artworks: ArtworkRail_artworks$key
  onPress?: (artwork: ArtworkRail_artworks$data[0], index: number) => void
  dark?: boolean
  hideArtistName?: boolean
  hideCuratorsPickSignal?: boolean
  hideIncreasedInterestSignal?: boolean
  showPartnerName?: boolean
  ListFooterComponent?: ReactElement | null
  ListHeaderComponent?: ReactElement | null
  listRef?: React.RefObject<FlatList<any>>
  onEndReached?: () => void
  onEndReachedThreshold?: number
  onMorePress?: () => void
  onViewableItemsChanged?: (info: { viewableItems: any[]; changed: any[] }) => void
  showSaveIcon?: boolean
  viewabilityConfig?: ViewabilityConfig | undefined
}

export const ArtworkRail: React.FC<ArtworkRailProps> = ({
  listRef,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = <Spacer x={2} />,
  ListFooterComponent = <Spacer x={2} />,
  hideArtistName = false,
  showPartnerName = true,
  dark = false,
  showSaveIcon = false,
  viewabilityConfig,
  onViewableItemsChanged,
  onMorePress,
  hideIncreasedInterestSignal,
  hideCuratorsPickSignal,
  ...otherProps
}) => {
  const artworks = useFragment(artworksFragment, otherProps.artworks)

  const renderItem: ListRenderItem<Artwork> = useCallback(
    ({ item, index }) => {
      return (
        <Box pr={2}>
          <ArtworkRailCard
            testID={`artwork-${item.slug}`}
            artwork={item}
            showPartnerName={showPartnerName}
            hideArtistName={hideArtistName}
            dark={dark}
            onPress={() => {
              onPress?.(item, index)
            }}
            showSaveIcon={showSaveIcon}
            hideIncreasedInterestSignal={hideIncreasedInterestSignal}
            hideCuratorsPickSignal={hideCuratorsPickSignal}
            {...extractArtworkActionTrackingProps(otherProps)}
          />
        </Box>
      )
    },
    [hideArtistName, onPress, showPartnerName]
  )
  return (
    <PrefetchFlashList
      data={artworks}
      estimatedItemSize={ARTWORK_RAIL_CARD_MINIMUM_WIDTH}
      horizontal
      keyExtractor={(item) => item.internalID}
      ListFooterComponent={
        <>
          {!!onMorePress && (
            <BrowseMoreRailCard dark={dark} onPress={onMorePress} text="Browse All Artworks" />
          )}
          {ListFooterComponent}
        </>
      }
      ListHeaderComponent={ListHeaderComponent}
      listRef={listRef}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onViewableItemsChanged={onViewableItemsChanged}
      prefetchUrlExtractor={(item) => item?.href || undefined}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      viewabilityConfig={viewabilityConfig}
    />
  )
}

const artworksFragment = graphql`
  fragment ArtworkRail_artworks on Artwork @relay(plural: true) {
    collectorSignals {
      primaryLabel
      auction {
        bidCount
        lotWatcherCount
      }
    }
    href
    internalID
    slug

    ...ArtworkRailCard_artwork
  }
`

export const ArtworkRailPlaceholder: React.FC = () => {
  const enableArtworkRailRedesignImageAspectRatio = !useFeatureFlag(
    "AREnableArtworkRailRedesignImageAspectRatio"
  )

  return (
    <Join separator={<Spacer x="15px" />}>
      {times(3 + useMemoizedRandom() * 10).map((index) => (
        <Flex key={index}>
          {enableArtworkRailRedesignImageAspectRatio ? (
            <SkeletonBox
              height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
              width={ARTWORK_RAIL_MIN_IMAGE_WIDTH * 2}
            />
          ) : (
            <SkeletonBox
              height={LEGACY_ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
              width={ARTWORK_RAIL_IMAGE_WIDTH}
            />
          )}
          <Spacer y={2} />
          <SkeletonText>Artist</SkeletonText>
          <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
        </Flex>
      ))}
    </Join>
  )
}
