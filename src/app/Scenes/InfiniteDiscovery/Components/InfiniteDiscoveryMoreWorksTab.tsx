import { OwnerType } from "@artsy/cohesion"
import { Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { InfiniteDiscoveryMoreWorksTab_artworks$key } from "__generated__/InfiniteDiscoveryMoreWorksTab_artworks.graphql"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { PAGE_SIZE } from "app/Components/constants"
import { aboutTheWorkQuery } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheet"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { FC, useCallback } from "react"
import { graphql, PreloadedQuery, usePaginationFragment, usePreloadedQuery } from "react-relay"

interface MoreWorksTabProps {
  artworks: InfiniteDiscoveryMoreWorksTab_artworks$key
}

export const MoreWorksTab: FC<MoreWorksTabProps> = ({ artworks: _artworks }) => {
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment(fragment, _artworks)
  const space = useSpace()
  const { width } = useScreenDimensions()

  const artworks = extractNodes(data.artworksConnection)

  const loadMore = () => {
    if (!!hasNext && !isLoadingNext) {
      loadNext(PAGE_SIZE)
    }
  }

  const renderItem = useCallback(({ item, index, columnIndex }) => {
    const imgAspectRatio = item.image?.aspectRatio ?? 1
    const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
    const imgHeight = imgWidth / imgAspectRatio

    return (
      <Flex
        pl={columnIndex === 0 ? 0 : 1}
        pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
        mt={2}
      >
        <ArtworkGridItem
          itemIndex={index}
          // TODO: add tracking
          contextScreenOwnerType={OwnerType.infiniteDiscovery}
          contextScreenOwnerId=""
          contextScreenOwnerSlug=""
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  return (
    <Tabs.Masonry
      data={artworks}
      numColumns={NUM_COLUMNS_MASONRY}
      estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item?.internalID}
      ListEmptyComponent={<FilteredArtworkGridZeroState />}
      ListFooterComponent={
        <AnimatedMasonryListFooter shouldDisplaySpinner={!!hasNext && !!isLoadingNext} />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
      renderItem={renderItem}
    />
  )
}

export const InfiniteDiscoveryMoreWorksTabSkeleton: FC = () => {
  return null
}

const fragment = graphql`
  fragment InfiniteDiscoveryMoreWorksTab_artworks on Query
  @refetchable(queryName: "InfiniteDiscoveryMoreWorksQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 12 }
    cursor: { type: "String" }
    artistIDs: { type: "[String!]" }
  ) {
    artworksConnection(first: $count, after: $cursor, artistIDs: $artistIDs)
      @connection(key: "InfiniteDiscoveryMoreWorks_artworksConnection") {
      edges {
        node {
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          internalID
          image(includeAll: false) {
            aspectRatio
          }
        }
      }
    }
  }
`

interface InfiniteDiscoveryMoreWorksTabProps {
  queryRef: PreloadedQuery<any>
}

export const InfiniteDiscoveryMoreWorksTab: FC<InfiniteDiscoveryMoreWorksTabProps> = ({
  queryRef,
}) => {
  const data = usePreloadedQuery(aboutTheWorkQuery, queryRef)

  if (!data) {
    return null
  }

  return <MoreWorksTab artworks={data} />
}
