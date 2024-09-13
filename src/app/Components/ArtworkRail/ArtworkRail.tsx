import { Box, Spacer } from "@artsy/palette-mobile"
import { LargeArtworkRail_artworks$data } from "__generated__/LargeArtworkRail_artworks.graphql"
import { SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data } from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { SmallArtworkRail_artworks$data } from "__generated__/SmallArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { BrowseMoreRailCard } from "app/Components/BrowseMoreRailCard"
import { Disappearable, DissapearableArtwork } from "app/Components/Disappearable"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import {
  ArtworkActionTrackingProps,
  extractArtworkActionTrackingProps,
} from "app/utils/track/ArtworkActions"
import React, { ReactElement } from "react"
import { FlatList, ViewabilityConfig } from "react-native"
import { isTablet } from "react-native-device-info"

const MAX_NUMBER_OF_ARTWORKS = 30

interface CommonArtworkRailProps {
  dark?: boolean
  hideArtistName?: boolean
  showPartnerName?: boolean
  ListFooterComponent?: ReactElement | null
  ListHeaderComponent?: ReactElement | null
  listRef?: React.RefObject<FlatList<any>>
  onEndReached?: () => void
  onEndReachedThreshold?: number
  size: ArtworkCardSize
  showSaveIcon?: boolean
  onMorePress?: () => void
  viewabilityConfig?: ViewabilityConfig | undefined
  onViewableItemsChanged?: (info: { viewableItems: any[]; changed: any[] }) => void
  hideIncreasedInterestSignal?: boolean
  hideCuratorsPickSignal?: boolean
}

export interface ArtworkRailProps extends CommonArtworkRailProps, ArtworkActionTrackingProps {
  artworks: LargeArtworkRail_artworks$data | SmallArtworkRail_artworks$data
  onPress?: (
    artwork: LargeArtworkRail_artworks$data[0] | SmallArtworkRail_artworks$data[0],
    index: number
  ) => void
}

export const ArtworkRail: React.FC<ArtworkRailProps> = ({
  listRef,
  size,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = SpacerComponent,
  ListFooterComponent = SpacerComponent,
  hideArtistName = false,
  showPartnerName = true,
  dark = false,
  artworks,
  showSaveIcon = false,
  viewabilityConfig,
  onViewableItemsChanged,
  onMorePress,
  hideIncreasedInterestSignal,
  hideCuratorsPickSignal,
  ...otherProps
}) => {
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
                size={size}
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

type RecentlySoldArtwork = NonNullable<
  NonNullable<SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data["edges"]>[0]
>["node"]

export interface RecentlySoldArtworksRailProps extends CommonArtworkRailProps {
  recentlySoldArtworks: RecentlySoldArtwork[]
  onPress?: (recentlySoldArtwork: RecentlySoldArtwork, index: number) => void
}

export const RecentlySoldArtworksRail: React.FC<RecentlySoldArtworksRailProps> = ({
  listRef,
  size,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = SpacerComponent,
  ListFooterComponent = SpacerComponent,
  hideArtistName = false,
  recentlySoldArtworks,
  showPartnerName = true,
}) => {
  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.artwork?.href || undefined}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={() => <Spacer x="15px" />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artworks to not cause layout shifts
      data={recentlySoldArtworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => {
        if (!item?.artwork) {
          return null
        }

        return (
          <ArtworkRailCard
            artwork={item.artwork}
            onPress={() => {
              onPress?.(item, index)
            }}
            priceRealizedDisplay={item?.priceRealized?.display || ""}
            lowEstimateDisplay={item?.lowEstimate?.display || ""}
            highEstimateDisplay={item?.highEstimate?.display || ""}
            performanceDisplay={item?.performance?.mid ?? undefined}
            size={size}
            showPartnerName={showPartnerName}
            isRecentlySoldArtwork
            hideArtistName={hideArtistName}
          />
        )
      }}
      keyExtractor={(item, index) => String(item?.artwork?.slug || index)}
    />
  )
}

const SpacerComponent = () => <Spacer x={2} />
