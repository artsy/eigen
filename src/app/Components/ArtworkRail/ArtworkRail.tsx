import { Flex, SkeletonBox, SkeletonText, Spacer, useSpace } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import {
  ArtworkRail_artworks$data,
  ArtworkRail_artworks$key,
} from "__generated__/ArtworkRail_artworks.graphql"
import {
  ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT,
  ArtworkRailCard,
} from "app/Components/ArtworkRail/ArtworkRailCard"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { RandomWidthPlaceholderText } from "app/utils/placeholders"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import React, { memo, ReactElement, useCallback } from "react"
import { FlatList, ListRenderItem, Platform, ViewabilityConfig } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

export const INITIAL_NUM_TO_RENDER = isTablet() ? 10 : 5

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
  itemHref?(artwork: Artwork): string
  onEndReached?: () => void
  onEndReachedThreshold?: number
  moreHref?: string | null
  onMorePress?: () => void
  onViewableItemsChanged?: (info: { viewableItems: any[]; changed: any[] }) => void
  showSaveIcon?: boolean
  viewabilityConfig?: ViewabilityConfig | undefined
}

export const ArtworkRail: React.FC<ArtworkRailProps> = memo(
  ({
    listRef,
    onPress,
    onEndReached,
    onEndReachedThreshold,
    ListHeaderComponent = <Spacer x={2} />,
    ListFooterComponent = <Spacer x={2} />,
    hideArtistName = false,
    itemHref,
    showPartnerName = true,
    dark = false,
    showSaveIcon = false,
    viewabilityConfig,
    onViewableItemsChanged,
    moreHref,
    onMorePress,
    hideIncreasedInterestSignal,
    hideCuratorsPickSignal,
    ...otherProps
  }) => {
    const artworks = useFragment(artworksFragment, otherProps.artworks)
    const space = useSpace()

    const renderItem: ListRenderItem<Artwork> = useCallback(
      ({ item, index }) => {
        return (
          <ArtworkRailCard
            testID={`artwork-${item.slug}`}
            artwork={item}
            href={itemHref?.(item)}
            showPartnerName={showPartnerName}
            hideArtistName={hideArtistName}
            dark={dark}
            onPress={() => {
              onPress?.(item, index)
            }}
            showSaveIcon={showSaveIcon}
            hideIncreasedInterestSignal={hideIncreasedInterestSignal}
            hideCuratorsPickSignal={hideCuratorsPickSignal}
            {...otherProps}
          />
        )
      },
      [hideArtistName, onPress, showPartnerName]
    )

    // On android we are using a flatlist to fix some image issues
    // Context https://github.com/artsy/eigen/pull/11207
    const ListComponent =
      Platform.OS === "ios"
        ? (props: any) => (
            <FlashList
              estimatedItemSize={
                ARTWORK_RAIL_CARD_IMAGE_HEIGHT + ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + space(1)
              }
              {...props}
            />
          )
        : FlatList

    return (
      <ListComponent
        data={artworks}
        horizontal
        keyExtractor={(item: Artwork) => item.internalID}
        ListFooterComponent={
          <>
            {!!(onMorePress || moreHref) && (
              <BrowseMoreRailCard
                dark={dark}
                href={moreHref}
                onPress={onMorePress}
                text="Browse All Artworks"
              />
            )}
            {ListFooterComponent}
          </>
        }
        ListHeaderComponent={ListHeaderComponent}
        listRef={listRef}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig}
      />
    )
  }
)

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
  const cards = !isTablet() ? 2 : 6

  return (
    <Flex gap={2} flexDirection="row">
      {Array.from({ length: cards }).map((_, index) => (
        <Flex key={index}>
          <SkeletonBox
            height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
            width={ARTWORK_RAIL_CARD_MIN_WIDTH * 2}
          />
          <Spacer y={2} />
          <SkeletonText>Artist</SkeletonText>
          <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
        </Flex>
      ))}
    </Flex>
  )
}
