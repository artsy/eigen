import { Flex, Separator, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { CollectionsByFilterBodyQuery } from "__generated__/CollectionsByFilterBodyQuery.graphql"
import { CollectionsByFilterBody_viewer$key } from "__generated__/CollectionsByFilterBody_viewer.graphql"
import { CollectionRailPlaceholder } from "app/Scenes/CollectionsByCategory/CollectionRail"
import { CollectionsChipsPlaceholder } from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { CollectionsByFilterChips } from "app/Scenes/CollectionsByFilter/CollectionsByFilterChips"
import {
  CollectionsByFilterListItem,
  CollectionsByFilterListItemProps,
  ITEM_HEIGHT,
} from "app/Scenes/CollectionsByFilter/CollectionsByFilterListItem"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface CollectionsByFilterBodyProps {
  viewer: CollectionsByFilterBody_viewer$key
}

export const CollectionsByFilterBody: React.FC<CollectionsByFilterBodyProps> = ({ viewer }) => {
  const [state, setState] = useState<"loading" | "ready">("loading")
  const { data, isLoadingNext, hasNext, loadNext } = usePaginationFragment(fragment, viewer)
  const { title } = useCollectionsByCategoryParams()

  const filtersForArtworksConnection = extractNodes(
    data?.discoveryCategoryConnection?.filtersForArtworksConnection
  )
  const total = data?.discoveryCategoryConnection?.filtersForArtworksConnection?.totalCount ?? 0

  const loadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(10)
    }
  }, [isLoadingNext, hasNext, loadNext])

  useEffect(() => {
    loadMore()
  }, [loadMore])

  const header = useMemo(() => {
    if (!data?.discoveryCategoryConnection) {
      return null
    }

    return (
      <>
        <Flex gap={2}>
          <Text variant="xl" px={2}>
            {title}
          </Text>
          <Text px={2}>Explore collections by {title.toLowerCase()}</Text>

          <CollectionsByFilterChips discoveryCategories={data.discoveryCategoryConnection} />
        </Flex>

        <Separator borderColor="mono10" my={4} />
      </>
    )
  }, [data?.discoveryCategoryConnection, title])

  const renderItem = useCallback(
    ({ item }: { item: CollectionsByFilterListItemProps["artwork"] }) => {
      return <CollectionsByFilterListItem artwork={item} />
    },
    []
  )

  const footer = useMemo(() => {
    if (!isLoadingNext || total === 0) {
      return null
    }

    return (
      <>
        <Separator borderColor="mono10" mt={4} />
        {Array.from({ length: total - filtersForArtworksConnection.length }).map((_, i) => (
          <Flex key={`placeholder_${i}`} pt={4} gap={4}>
            <CollectionRailPlaceholder />
          </Flex>
        ))}
      </>
    )
  }, [filtersForArtworksConnection.length, isLoadingNext, total])

  if (!data?.discoveryCategoryConnection) {
    return null
  }

  return (
    <FlatList
      data={
        state === "ready" ? filtersForArtworksConnection : filtersForArtworksConnection.slice(0, 1)
      }
      keyExtractor={(_, i) => `filterElement-${i}`}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      // helps when preloading the screen, faster loading when navigating here
      onLayout={() => setState("ready")}
      onEndReachedThreshold={1}
      onEndReached={loadMore}
      maxToRenderPerBatch={4}
      initialNumToRender={2}
      windowSize={15}
      ItemSeparatorComponent={() => <Separator borderColor="mono10" my={4} />}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  )
}

const fragment = graphql`
  fragment CollectionsByFilterBody_viewer on Viewer
  @argumentDefinitions(
    categorySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 1 }
    cursor: { type: "String" }
  )
  @refetchable(queryName: "CollectionsByFilterBodyConnectionQuery") {
    discoveryCategoryConnection(slug: $categorySlug) {
      ...CollectionsByFilterChips_discoveryCategories

      slug @required(action: NONE)
      title

      filtersForArtworksConnection(first: $count, after: $cursor)
        @connection(key: "CollectionsByFilterBody_filtersForArtworksConnection") {
        totalCount
        edges {
          node {
            ...CollectionsByFilterListItem_artworkFilter
          }
        }
      }
    }
  }
`

const CollectionsByFilterBodyPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex gap={4}>
        <Flex gap={2} pl={2}>
          <SkeletonText variant="xl">Category</SkeletonText>

          <SkeletonText>Category description text</SkeletonText>

          <CollectionsChipsPlaceholder />
        </Flex>

        <Separator borderColor="mono10" />

        <CollectionRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

export const collectionsByFilterQuery = graphql`
  query CollectionsByFilterBodyQuery($categorySlug: String!) {
    viewer {
      ...CollectionsByFilterBody_viewer @arguments(categorySlug: $categorySlug)
    }
  }
`

export const CollectionsByFilterBodyWithSuspense = withSuspense({
  Component: () => {
    const { slug } = useCollectionsByCategoryParams()

    const data = useLazyLoadQuery<CollectionsByFilterBodyQuery>(collectionsByFilterQuery, {
      categorySlug: slug,
    })

    if (!data.viewer) {
      return null
    }

    return <CollectionsByFilterBody viewer={data.viewer} />
  },
  LoadingFallback: CollectionsByFilterBodyPlaceholder,
  ErrorFallback: NoFallback,
})
