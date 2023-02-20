import { Spacer } from "@artsy/palette-mobile"
import { LargeArtworkRail_artworks$data } from "__generated__/LargeArtworkRail_artworks.graphql"
import { SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection$data } from "__generated__/SellWithArtsyRecentlySold_recentlySoldArtworkTypeConnection.graphql"
import { SmallArtworkRail_artworks$data } from "__generated__/SmallArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { Schema } from "app/utils/track"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"

const MAX_NUMBER_OF_ARTWORKS = 30

interface CommonArtworkRailProps {
  hideArtistName?: boolean
  ListFooterComponent?: ReactElement | null
  ListHeaderComponent?: ReactElement | null
  listRef?: React.RefObject<FlatList<any>>
  onEndReached?: () => void
  onEndReachedThreshold?: number
  size: ArtworkCardSize
  showSaveIcon?: boolean
  trackingContextScreenOwnerType?: Schema.OwnerEntityTypes
}

export interface ArtworkRailProps extends CommonArtworkRailProps {
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
  artworks,
  showSaveIcon = false,
  trackingContextScreenOwnerType,
}) => {
  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.href!}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={() => <Spacer x="15px" />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artists to not cause layout shifts
      // @ts-expect-error
      data={artworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => (
        <ArtworkRailCard
          artwork={item}
          hidePartnerName
          hideArtistName={hideArtistName}
          onPress={() => {
            onPress?.(item, index)
          }}
          showSaveIcon={showSaveIcon}
          size={size}
          trackingContextScreenOwnerType={trackingContextScreenOwnerType}
        />
      )}
      keyExtractor={(item, index) => String(item.slug || index)}
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
}) => {
  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.artwork?.href!}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={() => <Spacer x="15px" />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artists to not cause layout shifts
      data={recentlySoldArtworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => (
        <ArtworkRailCard
          artwork={item?.artwork!}
          onPress={() => {
            onPress?.(item, index)
          }}
          priceRealizedDisplay={item?.priceRealized?.display!}
          lowEstimateDisplay={item?.lowEstimate?.display!}
          highEstimateDisplay={item?.highEstimate?.display!}
          size={size}
          hidePartnerName
          isRecentlySoldArtwork
          hideArtistName={hideArtistName}
        />
      )}
      keyExtractor={(item, index) => String(item?.artwork?.slug || index)}
    />
  )
}

const SpacerComponent = () => <Spacer x={2} />
