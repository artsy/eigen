import { Flex, Sans } from "@artsy/palette"
import { ArtistSeriesRail_collectionGroup } from "__generated__/ArtistSeriesRail_collectionGroup.graphql"
import { GenericArtistSeriesRail } from "lib/Components/ArtistSeriesRail"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ArtistSeriesRailProps {
  collectionGroup: ArtistSeriesRail_collectionGroup
}

export const ArtistSeriesRail: React.SFC<ArtistSeriesRailProps> = props => {
  const { collectionGroup } = props

  return (
    <ArtistSeriesWrapper>
      <CollectionName size="4" mb={2} ml={2}>
        {collectionGroup.name}
      </CollectionName>
      <GenericArtistSeriesRail collections={collectionGroup?.members} />
    </ArtistSeriesWrapper>
  )
}

const ArtistSeriesWrapper = styled(Flex)`
  margin-left: -20px;
`

export const ArtistSeriesMeta = styled(Sans)`
  margin: 0px 15px;
`

export const ArtistSeriesTitle = styled(Sans)`
  margin: 15px 15px 0px 15px;
`

export const CollectionName = styled(Sans)``

export const ArtistSeriesRailContainer = createFragmentContainer(ArtistSeriesRail, {
  collectionGroup: graphql`
    fragment ArtistSeriesRail_collectionGroup on MarketingCollectionGroup {
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
