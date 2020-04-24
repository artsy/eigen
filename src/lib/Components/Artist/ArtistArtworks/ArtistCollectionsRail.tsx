import { Box, Sans } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"

interface ArtistCollectionsRailProps {
  collections: ArtistArtworks_artist["iconicCollections"]
}

export const ArtistCollectionsRail: React.FC<ArtistCollectionsRailProps> = props => {
  const { collections } = props
  if (collections && collections.length > 1) {
    return (
      <Box>
        <Sans size="4" mb={1}>
          Iconic Collections
        </Sans>
        <ArtistSeriesRailWrapper>
          <GenericArtistSeriesRail collections={collections} />
        </ArtistSeriesRailWrapper>
        <Sans size="4" mb={1}>
          All Works
        </Sans>
      </Box>
    )
  }
  return null
}

const ArtistSeriesRailWrapper = styled(Box)`
  margin: 0px 0px 20px -40px;
`

export const ArtistCollectionsRailFragmentContainer = createFragmentContainer(ArtistCollectionsRail, {
  collections: graphql`
    fragment ArtistCollectionsRail_collections on MarketingCollection @relay(plural: true) {
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
    }
  `,
})
