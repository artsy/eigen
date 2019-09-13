import { Box, Join, Separator, Spacer } from "@artsy/palette"
import { Artwork_artwork } from "__generated__/Artwork_artwork.graphql"
import { OtherWorks_artwork } from "__generated__/OtherWorks_artwork.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { Schema } from "lib/utils/track"
import { filter } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ContextGridCTA } from "./ContextGridCTA"
import { Header } from "./Header"

type OtherWorksGrid = OtherWorks_artwork["contextGrids"][number]
type ArtworkGrid = Artwork_artwork["contextGrids"][number]
type Grid = OtherWorksGrid | ArtworkGrid

export const populatedGrids = (grids: ReadonlyArray<Grid>) => {
  if (grids && grids.length > 0) {
    return filter(grids, grid => {
      return grid.artworks && grid.artworks.edges && grid.artworks.edges.length > 0
    })
  }
}

export const OtherWorksFragmentContainer = createFragmentContainer<{ artwork: OtherWorks_artwork }>(
  props => {
    const grids = props.artwork.contextGrids
    const gridsToShow = populatedGrids(grids) as ReadonlyArray<OtherWorksGrid>

    if (gridsToShow && gridsToShow.length > 0) {
      return (
        <Join
          separator={
            <Box my={3}>
              <Separator />
            </Box>
          }
        >
          {gridsToShow.map((grid, index) => (
            <React.Fragment key={`Grid-${index}`}>
              <Header title={grid.title} />
              <Spacer mb={3} />
              <GenericGrid
                trackingFlow={Schema.Flow.RecommendedArtworks}
                contextModule={grid.__typename}
                artworks={grid.artworks.edges.map(({ node }) => node)}
              />
              <Box mt={2}>
                <ContextGridCTA contextModule={grid.__typename} href={grid.ctaHref} label={grid.ctaTitle} />
              </Box>
            </React.Fragment>
          ))}
        </Join>
      )
    }
  },
  {
    artwork: graphql`
      fragment OtherWorks_artwork on Artwork {
        contextGrids {
          __typename
          title
          ctaTitle
          ctaHref
          artworks: artworksConnection(first: 6) {
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  }
)
