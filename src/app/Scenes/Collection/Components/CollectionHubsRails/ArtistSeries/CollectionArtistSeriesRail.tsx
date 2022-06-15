import { CollectionArtistSeriesRail_collection$data } from "__generated__/CollectionArtistSeriesRail_collection.graphql"
import { GenericArtistSeriesRail } from "app/Components/GenericArtistSeriesRail"
import { Schema } from "app/utils/track"
import { Flex, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
// @ts-ignore
import styled from "styled-components/native"

import { CollectionArtistSeriesRail_collectionGroup$data } from "__generated__/CollectionArtistSeriesRail_collectionGroup.graphql"

interface CollectionArtistSeriesRailProps {
  collectionGroup: CollectionArtistSeriesRail_collectionGroup$data
  collection: CollectionArtistSeriesRail_collection$data
}

export const CollectionArtistSeriesRail: React.FC<CollectionArtistSeriesRailProps> = (props) => {
  const { collection, collectionGroup } = props

  const collections = collectionGroup?.members ?? []

  return (
    <Flex ml="-20px">
      <Sans size="4" mb={2} ml={4}>
        {collectionGroup.name}
      </Sans>
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
