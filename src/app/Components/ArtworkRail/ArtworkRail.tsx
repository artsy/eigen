import { Box, Flex, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import {
  ArtworkRail_artworks$data,
  ArtworkRail_artworks$key,
} from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_ARTWORKS,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { RandomWidthPlaceholderText, useMemoizedRandom } from "app/utils/placeholders"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import { times } from "lodash"
import React, { ReactElement } from "react"
import { FlatList, ViewabilityConfig } from "react-native"
import { graphql, useFragment } from "react-relay"

const MAX_NUMBER_OF_ARTWORKS = 30
export const ARTWORK_RAIL_IMAGE_WIDTH = 295

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
  const trackingProps = extractArtworkActionTrackingProps(otherProps)

  const artworks = useFragment(artworksFragment, otherProps.artworks)

  // TODO: Refactor this to use a better solution
  // We need to set the maximum number of artists to not cause layout shifts
  const artworksSlice = artworks.slice(0, MAX_NUMBER_OF_ARTWORKS).map((artwork) => {
    return {
      ...artwork,
      _disappearable: null,
    }
  })

  const handleSupress = async (item: DissapearableArtwork) => {
    await item._disappearable?.disappear()
  }

  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.href || undefined}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        onMorePress ? (
          <BrowseMoreRailCard dark={dark} onPress={onMorePress} text="Browse All Artworks" />
        ) : (
          ListFooterComponent
        )
      }
      showsHorizontalScrollIndicator={false}
      data={artworksSlice}
      initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_ARTWORKS}
      windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => {
        return (
          <Disappearable ref={(ref) => ((item as any)._disappearable = ref)}>
            <Box pr="15px">
              <ArtworkRailCard
                testID={`artwork-${item.slug}`}
                {...trackingProps}
                artwork={item}
                showPartnerName={showPartnerName}
                hideArtistName={hideArtistName}
                dark={dark}
                onPress={() => {
                  onPress?.(item, index)
                }}
                showSaveIcon={showSaveIcon}
                onSupressArtwork={() => {
                  handleSupress(item)
                }}
                hideIncreasedInterestSignal={hideIncreasedInterestSignal}
                hideCuratorsPickSignal={hideCuratorsPickSignal}
              />
            </Box>
          </Disappearable>
        )
      }}
      keyExtractor={(item, index) => String(item.slug || index)}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  )
}

const artworksFragment = graphql`
  fragment ArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork
    internalID
    href
    slug
    collectorSignals {
      primaryLabel
      auction {
        bidCount
        lotWatcherCount
      }
    }
  }
`

export const ArtworkRailPlaceholder: React.FC = () => (
  <Join separator={<Spacer x="15px" />}>
    {times(3 + useMemoizedRandom() * 10).map((index) => (
      <Flex key={index}>
        <SkeletonBox height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT} width={ARTWORK_RAIL_IMAGE_WIDTH} />
        <Spacer y={2} />
        <SkeletonText>Artist</SkeletonText>
        <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
      </Flex>
    ))}
  </Join>
)
