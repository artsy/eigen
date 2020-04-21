import { Sans } from "@artsy/palette"
import { ArtistCollectionsRail_collections } from "__generated__/ArtistCollectionsRail_collections.graphql"
import { GenericArtistSeriesRail } from "lib/Components/ArtistSeriesRail"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistCollectionsRailProps {
  collections: ArtistCollectionsRail_collections
}

const ArtistCollectionsRail: React.FC<ArtistCollectionsRailProps> = props => {
  // console.log("props", props)
  const { collections } = props
  return <GenericArtistSeriesRail collections={collections} />
}

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
