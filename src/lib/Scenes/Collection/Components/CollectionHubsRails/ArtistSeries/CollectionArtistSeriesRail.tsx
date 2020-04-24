import { Flex, Sans } from "@artsy/palette"
import { CollectionArtistSeriesRail_collectionGroup } from "__generated__/CollectionArtistSeriesRail_collectionGroup.graphql"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"

interface CollectionArtistSeriesRailProps {
  collectionGroup: CollectionArtistSeriesRail_collectionGroup
}

export const CollectionArtistSeriesRail: React.SFC<CollectionArtistSeriesRailProps> = props => {
  const { collectionGroup } = props
  const collections = collectionGroup?.members ?? []

  return (
    <CollectionArtistSeriesWrapper>
      <CollectionName size="4" mb={2} ml={4}>
        {collectionGroup.name}
      </CollectionName>
      <GenericArtistSeriesRail collections={collections} />
    </CollectionArtistSeriesWrapper>
  )
}

const CollectionArtistSeriesWrapper = styled(Flex)`
  margin-left: -20px;
`

export const CollectionName = styled(Sans)``

export const CollectionArtistSeriesRailContainer = createFragmentContainer(CollectionArtistSeriesRail, {
  collectionGroup: graphql`
    fragment CollectionArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
      name
      members {
        slug
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
        defaultHeader: artworksConnection(sort: "-decayed_merch", first: 1) {
          edges {
            node {
              image {
                url
              }
            }
          }
        }
      }
    }
  `,
})
