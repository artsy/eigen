import { Flex } from "@artsy/palette-mobile"
import { CollectionArtistSeriesRail_collection$data } from "__generated__/CollectionArtistSeriesRail_collection.graphql"
import { CollectionArtistSeriesRail_collectionGroup$data } from "__generated__/CollectionArtistSeriesRail_collectionGroup.graphql"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { Schema } from "app/utils/track"
import { Text } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionArtistSeriesRailProps {
  collectionGroup: CollectionArtistSeriesRail_collectionGroup$data
  collection: CollectionArtistSeriesRail_collection$data
}

export const CollectionArtistSeriesRail: React.FC<CollectionArtistSeriesRailProps> = (props) => {
  const { collection, collectionGroup } = props

  const collections = collectionGroup?.members ?? []

  return (
    <Flex ml={-2}>
      <Text variant="sm-display" mb={2} ml={4}>
        {collectionGroup.name}
      </Text>
      <GenericArtistSeriesRail
        collections={collections}
        contextScreenOwnerType={Schema.OwnerEntityTypes.Collection}
        contextScreenOwnerId={collection.id}
        contextScreenOwnerSlug={collection.slug}
      />
    </Flex>
  )
}

export const CollectionArtistSeriesRailContainer = createFragmentContainer(
  CollectionArtistSeriesRail,
  {
    collection: graphql`
      fragment CollectionArtistSeriesRail_collection on MarketingCollection {
        slug
        id
      }
    `,

    collectionGroup: graphql`
      fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
        name
        members {
          slug
          id
          title
          priceGuidance
          artworksConnection(first: 3, aggregations: [TOTAL], sort: "-decayed_merch") {
            edges {
              node {
                title
                image {
                  url
                }
              }
            }
          }
        }
      }
    `,
  }
)
