import { Spacer, Box, Text, useSpace } from "@artsy/palette-mobile"
import { Artwork_artworkBelowTheFold$data } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { OtherWorks_artwork$data } from "__generated__/OtherWorks_artwork.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { filter } from "lodash"
import { Join, Separator } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { ContextGridCTA } from "./ContextGridCTA"

type OtherWorksGrid = NonNullable<NonNullable<OtherWorks_artwork$data["contextGrids"]>[number]>
type ArtworkGrid = NonNullable<
  NonNullable<Artwork_artworkBelowTheFold$data["contextGrids"]>[number]
>
type Grid = OtherWorksGrid | ArtworkGrid

export const populatedGrids = (grids?: ReadonlyArray<Grid | null> | null) => {
  if (grids && grids.length > 0) {
    return filter(grids, (grid) => {
      return (grid?.artworks?.edges?.length ?? 0) > 0
    })
  }
}

export const OtherWorksFragmentContainer = createFragmentContainer<{
  artwork: OtherWorks_artwork$data
}>(
  (props) => {
    const { width } = useScreenDimensions()
    const space = useSpace()
    const grids = props.artwork.contextGrids
    const gridsToShow = populatedGrids(grids) as ReadonlyArray<OtherWorksGrid>

    if (gridsToShow && gridsToShow.length > 0) {
      return (
        <Join
          separator={
            <Box my={4}>
              <Separator />
            </Box>
          }
        >
          {gridsToShow.map((grid, index) => (
            <React.Fragment key={`Grid-${index}`}>
              <Text variant="md" textAlign="left">
                {grid.title}
              </Text>
              <Spacer y={2} />
              <GenericGrid
                trackingFlow={Schema.Flow.RecommendedArtworks}
                contextModule={grid.__typename}
                artworks={extractNodes(grid.artworks)}
                width={width - space(2)}
              />
              <Box mt={2}>
                <ContextGridCTA
                  contextModule={grid.__typename}
                  href={grid.ctaHref || undefined}
                  label={grid.ctaTitle!}
                />
              </Box>
            </React.Fragment>
          ))}
        </Join>
      )
    } else {
      return null
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
