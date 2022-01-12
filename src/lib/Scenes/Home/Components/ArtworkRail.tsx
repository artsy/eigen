import * as Analytics from "@artsy/cohesion"
import { ArtworkRail_artworks$key } from "__generated__/ArtworkRail_artworks.graphql"
import { ArtworkCardSize, ArtworkRailCard } from "lib/Components/ArtworkTileRail/ArtworkRailCard"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { navigate } from "lib/navigation/navigate"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"

const MAX_NUMBER_OF_ARTWORKS = 30
const DEFAULT_SIZE = "medium"

interface Props {
  artworks: ArtworkRail_artworks$key
  listRef: React.RefObject<FlatList<any>>
  contextModule: Analytics.ContextModule | undefined
  size?: ArtworkCardSize
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListFooterComponent?: ReactElement
}

export const ArtworkRail: React.FC<Props> = ({
  listRef,
  contextModule,
  size = DEFAULT_SIZE,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent = ListEndComponent,
  ...restProps
}) => {
  const tracking = useTracking()

  const artworks = useFragment<ArtworkRail_artworks$key>(artworksFragment, restProps.artworks)

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
        <ArtworkRailCard
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

const artworksFragment = graphql`
  fragment ArtworkRail_artworks on Artwork @relay(plural: true) {
    ...ArtworkRailCard_artwork @arguments(width: 295)
    href
    slug
  }
`
