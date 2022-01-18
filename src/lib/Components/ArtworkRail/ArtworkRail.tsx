import * as Analytics from "@artsy/cohesion"
import { LargeArtworkRail_artworks } from "__generated__/LargeArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "lib/Components/ArtworkRail/ArtworkRailCard"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { navigate } from "lib/navigation/navigate"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../../Scenes/Home/homeAnalytics"

const MAX_NUMBER_OF_ARTWORKS = 30

export interface ArtworkRailProps {
  artworks: LargeArtworkRail_artworks
  listRef?: React.RefObject<FlatList<any>>
  contextModule?: Analytics.ContextModule | undefined
  size: ArtworkCardSize
  onPress?: (index: number, id: string, slug: string, href: string | null) => void
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListFooterComponent?: ReactElement
}

export const ArtworkRail: React.FC<ArtworkRailProps> = ({
  listRef,
  contextModule,
  size,
  onPress,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent = SpacerComponent,
  artworks,
}) => {
  const tracking = useTracking()

  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.href!}
      listRef={listRef}
      horizontal
      ListHeaderComponent={SpacerComponent}
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
            if (onPress) {
              onPress(index, item.id, item.slug, item.href)
              return
            }

            if (item.href) {
              if (contextModule) {
                tracking.trackEvent(HomeAnalytics.artworkThumbnailTapEvent(contextModule, item.slug, index, "single"))
              }
              navigate(item.href!)
            }
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
