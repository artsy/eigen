import { Flex, Separator, Skeleton, SkeletonText, Spacer, Text } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { CollectionsByCategoryBodyQuery } from "__generated__/CollectionsByCategoryBodyQuery.graphql"
import { CollectionsByCategoryBody_viewer$key } from "__generated__/CollectionsByCategoryBody_viewer.graphql"
import {
  CollectionRailPlaceholder,
  CollectionRailWithSuspense,
} from "app/Scenes/CollectionsByCategory/Components/CollectionRail"
import {
  CollectionsByCategoryArtworksWithFiltersRailWithSuspense,
  hrefWithParams,
} from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryArtworksWithFiltersRail"
import { CollectionsByCategoryFooterWithSuspense } from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryFooter"
import {
  CollectionsChips,
  CollectionsChipsPlaceholder,
} from "app/Scenes/CollectionsByCategory/Components/CollectionsChips"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { compact } from "lodash"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionsByCategoryBodyProps {
  viewer: CollectionsByCategoryBody_viewer$key
}

export const CollectionsByCategoryBody: React.FC<CollectionsByCategoryBodyProps> = ({ viewer }) => {
  const data = useFragment(fragment, viewer)
  const { title } = useCollectionsByCategoryParams()

  if (
    !data?.discoveryCategoryConnection ||
    data.discoveryCategoryConnection.__typename === "%other"
  ) {
    return null
  }

  const discoveryCategory = data.discoveryCategoryConnection

  const chips =
    discoveryCategory.__typename === "DiscoveryMarketingCollection"
      ? discoveryCategory.marketingCollections.map((collection) => ({
          ...collection,
          href: `/collection/${collection.slug}`,
        }))
      : extractNodes(discoveryCategory.filtersForArtworksConnection).map((collection) => ({
          ...collection,
          href: hrefWithParams(collection.href, collection.title),
        }))

  const filtersForArtworks =
    discoveryCategory.__typename == "DiscoveryArtworksWithFiltersCollection"
      ? extractNodes(discoveryCategory.filtersForArtworksConnection)
      : null

  const discoverMarketingCollectionsRails =
    discoveryCategory.__typename === "DiscoveryMarketingCollection"
      ? discoveryCategory.marketingCollections.map((item, index) => {
          return {
            key: `artwork_rail_${item?.slug}`,
            jsx: () => (
              <CollectionRailWithSuspense
                key={`artwork_rail_${item?.slug}`}
                slug={item?.slug ?? ""}
                lastElement={index === discoveryCategory.marketingCollections.length - 1}
              />
            ),
          }
        })
      : []

  const filterForArtworksRails = filtersForArtworks
    ? filtersForArtworks.map((item, index) => {
        return {
          key: `artwork_filter_rail_${item?.href}`,
          jsx: () => (
            <CollectionsByCategoryArtworksWithFiltersRailWithSuspense
              {...item}
              filterSlug={item.slug}
              key={`artwork_filter_rail_${item?.href}`}
              lastElement={index === filtersForArtworks.length - 1}
            />
          ),
        }
      })
    : []

  const sections = compact([
    {
      key: "collectionChips",
      jsx: () => <CollectionsChips chips={chips} key="collectionChips" />,
    },
    ...discoverMarketingCollectionsRails,
    ...filterForArtworksRails,
    {
      key: "collectionsByCategoryFooter",
      jsx: () => <CollectionsByCategoryFooterWithSuspense />,
    },
  ])

  return (
    <FlashList
      data={sections}
      ListHeaderComponent={() => {
        return (
          <Flex mb={2}>
            <Text variant="xl" px={2}>
              {title}
            </Text>
            <Text px={2}>Explore collections by {title.toLowerCase()}</Text>
          </Flex>
        )
      }}
      renderItem={({ item }) => item.jsx()}
      estimatedItemSize={230} // Value from RN Debugger Inspector
      keyExtractor={(item) => item.key}
      ItemSeparatorComponent={() => <Spacer y={2} />}
    />
  )
}

export const ESTIMATED_ITEM_SIZE = 390

const fragment = graphql`
  fragment CollectionsByCategoryBody_viewer on Viewer
  @argumentDefinitions(categorySlug: { type: "String!" })
  @refetchable(queryName: "CollectionsByCategoryBodyConnectionQuery") {
    discoveryCategoryConnection(slug: $categorySlug) {
      __typename
      ... on DiscoveryMarketingCollection {
        category
        marketingCollections {
          slug
          title
        }
      }
      ... on DiscoveryArtworksWithFiltersCollection {
        category

        filtersForArtworksConnection(first: 20) {
          edges {
            node {
              title
              href
              slug
            }
          }
        }
      }
    }
  }
`

const CollectionsByCategoryBodyPlaceholder: React.FC = () => {
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

export const collectionsByCategoryQuery = graphql`
  query CollectionsByCategoryBodyQuery($categorySlug: String!) {
    viewer {
      ...CollectionsByCategoryBody_viewer @arguments(categorySlug: $categorySlug)
    }
  }
`

export const CollectionsByCategoryBodyWithSuspense = withSuspense({
  Component: () => {
    const { slug } = useCollectionsByCategoryParams()

    const data = useLazyLoadQuery<CollectionsByCategoryBodyQuery>(collectionsByCategoryQuery, {
      categorySlug: slug,
    })

    if (!data.viewer) {
      return null
    }

    return <CollectionsByCategoryBody viewer={data.viewer} />
  },
  LoadingFallback: CollectionsByCategoryBodyPlaceholder,
  ErrorFallback: NoFallback,
})
