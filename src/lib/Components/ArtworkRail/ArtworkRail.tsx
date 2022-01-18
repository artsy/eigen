import { LargeArtworkRail_artworks } from "__generated__/LargeArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "lib/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"

const MAX_NUMBER_OF_ARTWORKS = 30

export interface ArtworkRailProps {
  artworks: LargeArtworkRail_artworks
  listRef?: React.RefObject<FlatList<any>>
  size: ArtworkCardSize
  onPress?: (artwork: LargeArtworkRail_artworks[0], index: number) => void
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListHeaderComponent?: ReactElement | null
  ListFooterComponent?: ReactElement | null
}

export const ArtworkRail: React.FC<ArtworkRailProps> = ({
  listRef,
  size,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListHeaderComponent = SpacerComponent,
  ListFooterComponent = SpacerComponent,
  artworks,
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
      ItemSeparatorComponent={() => <Spacer width={15} />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artists to not cause layout shifts
      data={artworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => (
        <ArtworkRailCard
          onPress={() => {
            onPress?.(item, index)
          }}
          artwork={item}
          size={size}
          hidePartnerName
        />
      )}
      keyExtractor={(item, index) => String(item.slug || index)}
    />
  )
}

const SpacerComponent = () => <Spacer mr={2} />
