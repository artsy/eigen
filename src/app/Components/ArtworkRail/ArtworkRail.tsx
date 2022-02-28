import { LargeArtworkRail_artworks } from "__generated__/LargeArtworkRail_artworks.graphql"
import { SmallArtworkRail_artworks } from "__generated__/SmallArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "app/Components/PrefetchFlatList"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"

const MAX_NUMBER_OF_ARTWORKS = 30

export interface ArtworkRailProps {
  artworks: LargeArtworkRail_artworks | SmallArtworkRail_artworks
  listRef?: React.RefObject<FlatList<any>>
  size: ArtworkCardSize
  onPress?: (
    artwork: LargeArtworkRail_artworks[0] | SmallArtworkRail_artworks[0],
    index: number
  ) => void
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListHeaderComponent?: ReactElement | null
  ListFooterComponent?: ReactElement | null
  hideArtistName?: boolean
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
      // @ts-expect-error
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
          hideArtistName={hideArtistName}
        />
      )}
      keyExtractor={(item, index) => String(item.slug || index)}
    />
  )
}

const SpacerComponent = () => <Spacer mr={2} />
