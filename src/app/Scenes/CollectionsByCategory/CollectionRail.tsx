import {
  ArrowRightIcon,
  Flex,
  Skeleton,
  SkeletonText,
  Spacer,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { CollectionRailCollectionsByCategoryQuery } from "__generated__/CollectionRailCollectionsByCategoryQuery.graphql"
import { CollectionRail_marketingCollection$key } from "__generated__/CollectionRail_marketingCollection.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { ElementInView } from "app/utils/ElementInView"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense, NoFallback } from "app/utils/hooks/withSuspense"
import { useClientQuery } from "app/utils/useClientQuery"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"

interface CollectionRailProps {
  collection: CollectionRail_marketingCollection$key
}

export const CollectionRail: FC<CollectionRailProps> = ({ collection: _collection }) => {
  const collection = useFragment(fragment, _collection)

  if (!collection || collection.artworksConnection?.counts.total === 0) {
    return null
  }

  const artworks = extractNodes(collection.artworksConnection)

  return (
    <Flex>
      <SectionTitle
        title={collection.title}
        onPress={() => {}}
        RightButtonContent={() => <ArrowRightIcon />}
      />
      <ArtworkRail artworks={artworks} ListHeaderComponent={null} />
    </Flex>
  )
}

const fragment = graphql`
  fragment CollectionRail_marketingCollection on MarketingCollection {
    title @required(action: NONE)

    artworksConnection(first: 10) {
      counts @required(action: NONE) {
        total
      }
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

export const CollectionRailPlaceholder: FC = () => {
  return (
    <Skeleton>
      <Flex justifyContent="space-between" flexDirection="row">
        <SkeletonText>Category title</SkeletonText>
        <ArrowRightIcon />
      </Flex>

      <Spacer y={1} />

      <Flex flexDirection="row">
        <ArtworkRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
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

export const CollectionRailWithSuspense = withSuspense<CollectionRailWithSuspenseProps>({
  Component: ({ slug }) => {
    const { height } = useScreenDimensions()
    const [isVisible, setIsVisible] = useState(false)
    const { data, loading } = useClientQuery<CollectionRailCollectionsByCategoryQuery>({
      query,
      variables: { slug },
      skip: !isVisible,
    })

    const handleOnVisible = () => {
      if (!isVisible) {
        setIsVisible(true)
      }
    }

    if (loading || !data?.marketingCollection || !isVisible) {
      // We don't need to overfetch all rails at once, fetch as they become closer to be visible
      return (
        <ElementInView onVisible={handleOnVisible} visibilityMargin={-height}>
          <CollectionRailPlaceholder />
        </ElementInView>
      )
    }

    return <CollectionRail collection={data.marketingCollection} />
  },
  ErrorFallback: NoFallback,
  LoadingFallback: CollectionRailPlaceholder,
})
