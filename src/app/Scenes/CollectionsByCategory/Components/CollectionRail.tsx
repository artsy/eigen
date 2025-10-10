import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Separator, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { ArtworkRail_artworks$data } from "__generated__/ArtworkRail_artworks.graphql"
import { CollectionRailCollectionsByCategoryQuery } from "__generated__/CollectionRailCollectionsByCategoryQuery.graphql"
import { CollectionRail_marketingCollection$key } from "__generated__/CollectionRail_marketingCollection.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionRailProps {
  collection: CollectionRail_marketingCollection$key
  lastElement?: boolean
}

export const CollectionRail: FC<CollectionRailProps> = ({
  collection: _collection,
  lastElement,
}) => {
  const collection = useFragment(fragment, _collection)
  const { trackArtworkRailItemTap, trackArtworkRailViewAllTap } = useCollectionByCategoryTracking()

  const artworks = extractNodes(collection?.artworksConnection)

  if (!collection || !artworks.length) {
    return null
  }

  const handleArtworkPress = (artwork: ArtworkRail_artworks$data[0], index: number) => {
    trackArtworkRailItemTap(artwork.internalID, index)
  }

  const handleTitlePress = () => {
    trackArtworkRailViewAllTap(collection.slug)
  }

  if (!artworks.length) {
    return null
  }

  return (
    <>
      <Flex pl={2}>
        <SectionTitle
          href={`/collection/${collection.slug}`}
          onPress={handleTitlePress}
          pr={2}
          RightButtonContent={() => <ChevronRightIcon fill="mono60" ml={0.5} />}
          title={collection.title}
          titleVariant="md"
        />

        <ArtworkRail
          onPress={handleArtworkPress}
          artworks={artworks}
          ListHeaderComponent={null}
          showSaveIcon
          showPartnerName
        />
      </Flex>
      {!!lastElement && <Separator borderColor="mono10" my={4} />}
    </>
  )
}

const fragment = graphql`
  fragment CollectionRail_marketingCollection on MarketingCollection {
    title @required(action: NONE)
    slug @required(action: NONE)

    artworksConnection(first: 10, sort: "-decayed_merch") {
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

export const CollectionRailPlaceholder: FC<Partial<CollectionRailProps>> = ({ lastElement }) => {
  return (
    <Skeleton>
      <Flex pl={2}>
        <Flex justifyContent="space-between" flexDirection="row" pr={2}>
          <SkeletonText variant="md">Category title</SkeletonText>
          <ChevronRightIcon />
        </Flex>

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

export const CollectionsByCategoryCollectionRailQuery = graphql`
  query CollectionRailCollectionsByCategoryQuery($slug: String!) {
    marketingCollection(slug: $slug) {
      ...CollectionRail_marketingCollection

      title
      markdownDescription
    }
  }
`

interface CollectionRailWithSuspenseProps {
  slug: string
}

export const CollectionRailWithSuspense = withSuspense<
  CollectionRailWithSuspenseProps & Partial<CollectionRailProps>
>({
  Component: ({ slug, lastElement }) => {
    const data = useLazyLoadQuery<CollectionRailCollectionsByCategoryQuery>(
      CollectionsByCategoryCollectionRailQuery,
      { slug },
      { fetchPolicy: "store-and-network" }
    )

    if (!data?.marketingCollection) {
      return <CollectionRailPlaceholder lastElement={lastElement} />
    }

    return <CollectionRail collection={data.marketingCollection} lastElement={lastElement} />
  },
  ErrorFallback: NoFallback,
  LoadingFallback: CollectionRailPlaceholder,
})
