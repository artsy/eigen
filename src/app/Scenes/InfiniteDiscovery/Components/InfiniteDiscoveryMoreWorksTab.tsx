import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SimpleMessage, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { MasonryListRenderItem } from "@shopify/flash-list"
import { InfiniteDiscoveryMoreWorksTabQuery } from "__generated__/InfiniteDiscoveryMoreWorksTabQuery.graphql"
import { InfiniteDiscoveryMoreWorksTab_artworks$key } from "__generated__/InfiniteDiscoveryMoreWorksTab_artworks.graphql"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { FC, useCallback } from "react"
import { Platform } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

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

  const renderItem: MasonryListRenderItem<ExtractNodeType<typeof data.artworksConnection>> =
    useCallback(({ item, index, columnIndex }) => {
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
            contextModule={ContextModule.infiniteDiscoveryDrawer}
            contextScreenOwnerType={OwnerType.infiniteDiscoveryArtwork}
            contextScreenOwnerId={item.internalID}
            contextScreenOwnerSlug={item.slug}
            artwork={item}
            height={imgHeight}
          />
        </Flex>
      )
    }, [])

  const masonry = (
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

  // wrap the masonry in a scroll view if on Android, otherwise the masonry will not scroll
  return Platform.OS === "ios" ? masonry : <BottomSheetScrollView>{masonry}</BottomSheetScrollView>
}

const fragment = graphql`
  fragment InfiniteDiscoveryMoreWorksTab_artworks on Query
  @refetchable(queryName: "InfiniteDiscoveryMoreWorksQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 12 }
    cursor: { type: "String" }
    artistIDs: { type: "[String!]" }
  ) {
    artworksConnection(
      first: $count
      after: $cursor
      artistIDs: $artistIDs
      sort: "-decayed_merch"
    ) @connection(key: "InfiniteDiscoveryMoreWorks_artworksConnection") {
      edges {
        node {
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          internalID
          slug
          image(includeAll: false) {
            aspectRatio
          }
        }
      }
    }
  }
`

const infiniteDiscoveryMoreWorksQuery = graphql`
  query InfiniteDiscoveryMoreWorksTabQuery($artistIDs: [String!]!) {
    ...InfiniteDiscoveryMoreWorksTab_artworks @arguments(artistIDs: $artistIDs)
  }
`

interface InfiniteDiscoveryMoreWorksTabProps {
  artistIDs: string[]
}

export const InfiniteDiscoveryMoreWorksTab: FC<InfiniteDiscoveryMoreWorksTabProps> = withSuspense({
  Component: ({ artistIDs }) => {
    const data = useLazyLoadQuery<InfiniteDiscoveryMoreWorksTabQuery>(
      infiniteDiscoveryMoreWorksQuery,
      {
        artistIDs,
      }
    )

    if (!data) {
      return (
        <Tabs.ScrollView>
          <SimpleMessage m={2}>Cannot load more works.</SimpleMessage>
        </Tabs.ScrollView>
      )
    }

    return <MoreWorksTab artworks={data} />
  },
  LoadingFallback: () => {
    return <InfiniteDiscoveryMoreWorksTabSkeleton />
  },
  ErrorFallback: () => {
    return <InfiniteDiscoveryMoreWorksTabErrorFallback />
  },
})

const InfiniteDiscoveryMoreWorksTabSkeleton: React.FC<{}> = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView contentContainerStyle={{ marginTop: space(2) }}>
      <PlaceholderGrid />
    </Tabs.ScrollView>
  )
}

const InfiniteDiscoveryMoreWorksTabErrorFallback: React.FC<{}> = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView contentContainerStyle={{ marginTop: space(2) }}>
      <SimpleMessage m={2}>Cannot load more works.</SimpleMessage>
    </Tabs.ScrollView>
  )
}
