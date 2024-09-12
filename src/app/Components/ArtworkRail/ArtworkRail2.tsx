import { Box, Flex, Join, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import {
  ArtworkRail2_artworks$data,
  ArtworkRail2_artworks$key,
} from "__generated__/ArtworkRail2_artworks.graphql"
import {
  ARTWORK_RAIL_CARD_IMAGE_HEIGHT,
  ArtworkRail2Card,
} from "app/Components/ArtworkRail/ArtworkRail2Card"
import { LARGE_RAIL_IMAGE_WIDTH } from "app/Components/ArtworkRail/LargeArtworkRail"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { RandomWidthPlaceholderText, useMemoizedRandom } from "app/utils/placeholders"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import { times } from "lodash"
import React, { ReactElement } from "react"
import { FlatList, ViewabilityConfig } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

const MAX_NUMBER_OF_ARTWORKS = 30

interface CommonArtworkRail2Props {
  dark?: boolean
  hideArtistName?: boolean
  showPartnerName?: boolean
  ListFooterComponent?: ReactElement | null
  ListHeaderComponent?: ReactElement | null
  listRef?: React.RefObject<FlatList<any>>
  onEndReached?: () => void
  onEndReachedThreshold?: number
  showSaveIcon?: boolean
  onMorePress?: () => void
  viewabilityConfig?: ViewabilityConfig | undefined
  onViewableItemsChanged?: (info: { viewableItems: any[]; changed: any[] }) => void
  hideIncreasedInterestSignal?: boolean
  hideCuratorsPickSignal?: boolean
}

export interface ArtworkRail2Props extends CommonArtworkRail2Props, ArtworkActionTrackingProps {
  artworks: ArtworkRail2_artworks$key
  onPress?: (artwork: ArtworkRail2_artworks$data[0], index: number) => void
}

export const ArtworkRail2: React.FC<ArtworkRail2Props> = ({
  listRef,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = SpacerComponent,
  ListFooterComponent = SpacerComponent,
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

  const trackingProps = extractArtworkActionTrackingProps(otherProps)

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
      initialNumToRender={isTablet() ? 10 : 5}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => {
        return (
          <Disappearable ref={(ref) => ((item as any)._disappearable = ref)}>
            <Box pr="15px">
              <ArtworkRail2Card
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
  fragment ArtworkRail2_artworks on Artwork @relay(plural: true) {
    ...ArtworkRail2Card_artwork @arguments(width: 590)
    internalID
    href
    slug
    collectorSignals {
      auction {
        bidCount
        liveBiddingStarted
        lotClosesAt
        lotWatcherCount
        registrationEndsAt
      }
      partnerOffer {
        isAvailable
      }
    }
  }
`

const SpacerComponent = () => <Spacer x={2} />

export const ArtworkRail2Placeholder: React.FC = () => (
  <Join separator={<Spacer x="15px" />}>
    {times(3 + useMemoizedRandom() * 10).map((index) => (
      <Flex key={index}>
        <SkeletonBox height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT} width={LARGE_RAIL_IMAGE_WIDTH} />
        <Spacer y={2} />
        <SkeletonText>Artist</SkeletonText>
        <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
      </Flex>
    ))}
  </Join>
)
