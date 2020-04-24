import { Box, Sans } from "@artsy/palette"
import { ArtistCollectionsRail_collections } from "__generated__/ArtistCollectionsRail_collections.graphql"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"

interface ArtistCollectionsRailProps {
  collections: ArtistCollectionsRail_collections
}

const ArtistCollectionsRail: React.FC<ArtistCollectionsRailProps> = props => {
  const { collections } = props
  return collections.length > 1 ? (
    <Box>
      <Sans size="4" mb={1}>
        Iconic Collections
      </Sans>
      <ArtistSeriesRailWrapper>
        <GenericArtistSeriesRail collections={collections} />
      </ArtistSeriesRailWrapper>
    </Box>
  ) : null
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
