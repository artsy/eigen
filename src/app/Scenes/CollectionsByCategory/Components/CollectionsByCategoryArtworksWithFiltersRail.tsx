import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Separator, Skeleton, Spacer } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { CollectionsByCategoryArtworksWithFiltersRailQuery } from "__generated__/CollectionsByCategoryArtworksWithFiltersRailQuery.graphql"
import { CollectionsByCategoryArtworksWithFiltersRail_viewer$key } from "__generated__/CollectionsByCategoryArtworksWithFiltersRail_viewer.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionsByCategoryArtworksWithFiltersRailProps {
  title: string
  href: string
  viewer: CollectionsByCategoryArtworksWithFiltersRail_viewer$key
  lastElement?: boolean
}

export const CollectionsByCategoryArtworksWithFiltersRail: FC<
  CollectionsByCategoryArtworksWithFiltersRailProps
> = ({ viewer, href, title, lastElement }) => {
  const data = useFragment(fragment, viewer)
  const { trackArtworkRailItemTap, trackArtworkRailViewAllTap } = useCollectionByCategoryTracking()

  const artworks = extractNodes(data?.discoveryCategoryArtworksConnection)

  if (!data || !artworks || !data.discoveryCategoryConnection) {
    return null
  }

  const handleArtworkPress = (artwork: ArtworkRail_artworks$data[0], index: number) => {
    trackArtworkRailItemTap(artwork.internalID, index)
  }

  const handleTitlePress = () => {
    trackArtworkRailViewAllTap(href)
  }

  return (
    <>
      <Flex>
        <SectionTitle
          href={hrefWithParams(href, title)}
          onPress={handleTitlePress}
          px={2}
          title={title}
          variant="large"
        />

        <ArtworkRail
          onPress={handleArtworkPress}
          artworks={artworks}
          showSaveIcon
          showPartnerName
        />
      </Flex>
      {!!lastElement && <Separator borderColor="mono10" my={4} />}
    </>
  )
}

const fragment = graphql`
  fragment CollectionsByCategoryArtworksWithFiltersRail_viewer on Viewer
  @argumentDefinitions(
    categorySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 10 }
    filterSlug: { type: "String!" }
  ) {
    discoveryCategoryConnection(slug: $categorySlug) {
      ... on DiscoveryArtworksWithFiltersCollection {
        href
        title
      }
    }
    discoveryCategoryArtworksConnection(
      categorySlug: $categorySlug
      first: $count
      filterSlug: $filterSlug
      sort: "-decayed_merch"
    ) {
      edges {
        node {
          ...ArtworkRail_artworks

          internalID
          slug
          href
        }
      }
    }
  }
`

export const CollectionsByCategoryArtworksWithFiltersRailPlaceholder: FC<
  Omit<CollectionsByCategoryArtworksWithFiltersRailProps, "viewer">
> = ({ title, href, lastElement }) => {
  return (
    <Skeleton>
      <Flex pl={2}>
        <SectionTitle
          href={hrefWithParams(href, title)}
          pr={2}
          onPress={() => {}}
          RightButtonContent={() => <ChevronRightIcon fill="mono60" ml={0.5} />}
          title={title}
          variant="large"
        />

        <Spacer y={1} />

        <Flex flexDirection="row">
          <ArtworkRailPlaceholder />
          <Separator borderColor="mono10" my={2} />
        </Flex>
      </Flex>

      {!!lastElement && <Separator borderColor="mono10" my={4} />}
    </Skeleton>
  )
}

export const collectionsByCategoryQuery = graphql`
  query CollectionsByCategoryArtworksWithFiltersRailQuery(
    $categorySlug: String!
    $filterSlug: String!
  ) {
    viewer {
      ...CollectionsByCategoryArtworksWithFiltersRail_viewer
        @arguments(categorySlug: $categorySlug, filterSlug: $filterSlug)
    }
  }
`

type CollectionsByCategoryArtworksWithFiltersRailWithSuspenseProps = Omit<
  CollectionsByCategoryArtworksWithFiltersRailProps,
  "viewer"
> & {
  filterSlug: string
}

export const CollectionsByCategoryArtworksWithFiltersRailWithSuspense =
  withSuspense<CollectionsByCategoryArtworksWithFiltersRailWithSuspenseProps>({
    Component: ({ filterSlug, href, title, lastElement }) => {
      const { slug } = useCollectionsByCategoryParams()
      const data = useLazyLoadQuery<CollectionsByCategoryArtworksWithFiltersRailQuery>(
        collectionsByCategoryQuery,
        {
          categorySlug: slug,
          filterSlug,
        }
      )

      if (!data.viewer) {
        return null
      }

      return (
        <CollectionsByCategoryArtworksWithFiltersRail
          viewer={data.viewer}
          title={title}
          href={href}
          lastElement={lastElement}
        />
      )
    },
    LoadingFallback: CollectionsByCategoryArtworksWithFiltersRailPlaceholder,
    ErrorFallback: NoFallback,
  })

export const hrefWithParams = (href?: string | null, title?: string | null) => {
  if (!href || !title) {
    return ""
  }

  return `${href}&title=${encodeURI(title)}&disableSubtitle=true`
}
