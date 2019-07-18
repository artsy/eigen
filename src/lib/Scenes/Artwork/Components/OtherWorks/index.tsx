import { Box, Join, Separator, Spacer } from "@artsy/palette"
import { OtherWorks_artwork } from "__generated__/OtherWorks_artwork.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { filter } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ContextGridCTA } from "./ContextGridCTA"
import { Header } from "./Header"

export const populatedGrids = (grids: OtherWorks_artwork["contextGrids"]) => {
  if (grids && grids.length > 0) {
    return filter(grids, grid => {
      return grid.artworks && grid.artworks.edges && grid.artworks.edges.length > 0
    })
  }
}

export const OtherWorksFragmentContainer = createFragmentContainer<{ artwork: OtherWorks_artwork }>(
  props => {
    const grids = props.artwork.contextGrids
    const gridsToShow = populatedGrids(grids)

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
              <GenericGrid artworks={grid.artworks.edges.map(({ node }) => node)} />
              <Box mt={2}>
                <ContextGridCTA href={grid.ctaHref} label={grid.ctaTitle} />
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
          title
          ctaTitle
          ctaHref
          artworks(first: 6) {
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
