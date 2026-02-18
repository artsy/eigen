import { Flex, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import {
  ArtworkRail_artworks$data,
  ArtworkRail_artworks$key,
} from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ARTWORK_RAIL_CARD_MIN_WIDTH,
} from "app/Components/ArtworkRail/ArtworkRailCardImage"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { isNewArchitectureEnabled } from "app/utils/isNewArchitectureEnabled"
import { RandomWidthPlaceholderText } from "app/utils/placeholders"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { memo, ReactElement, useCallback, useMemo } from "react"
import { FlatList, ListRenderItem, ViewabilityConfig } from "react-native"
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
  listRef?: React.Ref<FlatList<any>>
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
    onPress,
    onEndReached,
    onEndReachedThreshold,
    ListHeaderComponent = <Spacer x={2} />,
    ListFooterComponent = <Spacer x={2} />,
    hideArtistName = false,
    listRef,
    itemHref,
    showPartnerName = true,
    dark = false,
    showSaveIcon = false,
    onViewableItemsChanged,
    viewabilityConfig,
    moreHref,
    onMorePress,
    hideIncreasedInterestSignal,
    hideCuratorsPickSignal,
    ...otherProps
  }) => {
    const artworks = useFragment(artworksFragment, otherProps.artworks)

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

    const listFooterComponent = useMemo(() => {
      return (
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
      )
    }, [onMorePress, moreHref, dark, ListFooterComponent])

    return (
      <FlatList
        data={artworks}
        horizontal
        // This is required to avoid broken virtualization on nested flatlists
        // See https://artsy.slack.com/archives/C02BAQ5K7/p1752833523972209?thread_ts=1752761208.038099&cid=C02BAQ5K7
        disableVirtualization={!isNewArchitectureEnabled}
        keyExtractor={(item: Artwork) => item.internalID}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        ref={listRef}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        // Because this is a horizontal rail, we don't want to load more than 3 screens before and after
        // The default 21 (10 before and 10 after) is too much
        windowSize={isTablet() ? 10 : 5}
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
