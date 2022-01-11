import * as Analytics from "@artsy/cohesion"
import { SmallTileRail_artworks } from "__generated__/SmallTileRail_artworks.graphql"
import { ArtworkCardSize, ArtworkTileRailCard2 } from "lib/Components/ArtworkTileRail/ArtworkTileRailCard2"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { navigate } from "lib/navigation/navigate"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"

const MAX_NUMBER_OF_ARTWORKS = 30
const DEFAULT_SIZE = "medium"

interface Props {
  artworks: SmallTileRail_artworks
  listRef: React.RefObject<FlatList<any>>
  contextModule: Analytics.ContextModule | undefined
  size?: ArtworkCardSize
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListFooterComponent?: ReactElement
}

const SmallTileRail: React.FC<Props> = ({
  artworks,
  listRef,
  contextModule,
  size = DEFAULT_SIZE,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent = ListEndComponent,
}) => {
  const tracking = useTracking()

  return (
    <PrefetchFlatList
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      prefetchUrlExtractor={(item) => item?.href!}
      listRef={listRef}
      horizontal
      ListHeaderComponent={ListEndComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={() => <Spacer width={15} />}
      showsHorizontalScrollIndicator={false}
      // We need to set the maximum number of artists to not cause layout shifts
      data={artworks.slice(0, MAX_NUMBER_OF_ARTWORKS)}
      initialNumToRender={MAX_NUMBER_OF_ARTWORKS}
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => (
        <ArtworkTileRailCard2
          onPress={
            item.href
              ? () => {
                  if (contextModule) {
                    tracking.trackEvent(
                      HomeAnalytics.artworkThumbnailTapEvent(contextModule, item.slug, index, "single")
                    )
                  }
                  navigate(item.href!)
                }
              : undefined
          }
          artwork={item}
          size={size}
          hidePartnerName
        />
      )}
      keyExtractor={(item, index) => String(item.slug || index)}
    />
  )
}

const ListEndComponent = () => <Spacer mr={2} />

export const SmallTileRailContainer = createFragmentContainer(SmallTileRail, {
  artworks: graphql`
    fragment SmallTileRail_artworks on Artwork @relay(plural: true) {
      ...ArtworkTileRailCard2_artwork
      href
      slug
    }
  `,
})
