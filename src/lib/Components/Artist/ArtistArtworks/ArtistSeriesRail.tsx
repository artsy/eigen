import { Sans } from "@artsy/palette"
import { ArtistSeriesRail_collections } from "__generated__/ArtistSeriesRail_collections.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtistSeriesRailProps {
  collections: ArtistSeriesRail_collections
}

const ArtistSeriesRail: React.FC<ArtistSeriesRailProps> = props => {
  console.log("props", props)
  const { headerImage, slug } = props.collections[0]

  return (
    <>
      <Sans size="8">{headerImage}</Sans>
      <Sans size="8">{slug}</Sans>
    </>
  )
}

export const ArtistSeriesRailFragmentContainer = createFragmentContainer(ArtistSeriesRail, {
  collections: graphql`
    fragment ArtistSeriesRail_collections on MarketingCollection @relay(plural: true) {
      headerImage
      slug
      title
      price_guidance
    }
  `,
})
