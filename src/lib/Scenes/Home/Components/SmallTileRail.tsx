import * as Analytics from "@artsy/cohesion"
import { SmallTileRail_artworks } from "__generated__/SmallTileRail_artworks.graphql"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { PrefetchFlatList } from "lib/Components/PrefetchFlatList"
import { navigate } from "lib/navigation/navigate"
import { Spacer } from "palette"
import React, { ReactElement } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { getUrgencyTag } from "../../../utils/getUrgencyTag"
import HomeAnalytics from "../homeAnalytics"

interface Props {
  artworks: SmallTileRail_artworks
  listRef: React.RefObject<FlatList<any>>
  contextModule: Analytics.ContextModule | undefined
  imageSize?: "small" | "medium" | "large"
  onEndReached?: () => void
  onEndReachedThreshold?: number
  ListFooterComponent?: ReactElement
}

const SmallTileRail: React.FC<Props> = ({
  artworks,
  listRef,
  contextModule,
  imageSize,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent = ListEndComponent,
}) => {
  const tracking = useTracking()

  const numberOfArtworksForSmallSizeImage = 30
  const numberOfArtworksForLargeSizeImage = 12

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
      data={artworks}
      initialNumToRender={4}
      windowSize={imageSize === "small" ? numberOfArtworksForSmallSizeImage : numberOfArtworksForLargeSizeImage} // Based on number of artworks required in a rail
      contentContainerStyle={{ alignItems: "flex-end" }}
      renderItem={({ item, index }) => (
        <ArtworkTileRailCard
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
          imageURL={item.image?.imageURL ?? ""}
          imageSize={imageSize ?? "small"}
          imageAspectRatio={item.image?.aspectRatio}
          artistNames={item.artistNames}
          saleMessage={saleMessageOrBidInfo({ artwork: item, isSmallTile: true })}
          urgencyTag={item?.sale?.isAuction && !item?.sale?.isClosed ? getUrgencyTag(item?.sale?.endAt) : null}
        />
      )}
      keyExtractor={(item, index) => String(item.image?.imageURL || index)}
    />
  )
}

const ListEndComponent = () => <Spacer mr={2} />

export const SmallTileRailContainer = createFragmentContainer(SmallTileRail, {
  artworks: graphql`
    fragment SmallTileRail_artworks on Artwork @relay(plural: true) {
      href
      saleMessage
      artistNames
      slug
      internalID
      sale {
        isAuction
        isClosed
        displayTimelyAt
        endAt
      }
      saleArtwork {
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
      }
      partner {
        name
      }
      image {
        imageURL
        aspectRatio
      }
    }
  `,
})
