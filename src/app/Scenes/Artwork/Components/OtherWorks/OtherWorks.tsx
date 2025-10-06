import { Box, Join, Separator } from "@artsy/palette-mobile"
import { Artwork_artworkBelowTheFold$data } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { OtherWorks_artwork$data } from "__generated__/OtherWorks_artwork.graphql"
import { OtherWorksSection } from "app/Scenes/Artwork/Components/OtherWorks/OtherWorksSection"
import { filter } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export type OtherWorksGrid = NonNullable<
  NonNullable<OtherWorks_artwork$data["contextGrids"]>[number]
>
type ArtworkGrid = NonNullable<
  NonNullable<Artwork_artworkBelowTheFold$data["contextGrids"]>[number]
>
type Grid = OtherWorksGrid | ArtworkGrid

export const populatedGrids = (grids?: ReadonlyArray<Grid | null | undefined> | null) => {
  if (grids && grids.length > 0) {
    return filter(grids, (grid) => {
      return (grid?.artworks?.edges?.length ?? 0) > 0
    })
  }
}

const OtherWorks: React.FC<{ artwork: OtherWorks_artwork$data }> = ({ artwork }) => {
  const grids = artwork.contextGrids
  const gridsToShow = populatedGrids(grids) as ReadonlyArray<OtherWorksGrid>

  if (!grids?.length || gridsToShow.length === 0) {
    return null
  }

  return (
    <Join
      separator={
        <Box my={4}>
          <Separator />
        </Box>
      }
    >
      {gridsToShow.map((grid, index) => (
        <OtherWorksSection key={`Grid-${index}`} grid={grid} index={index} artwork={artwork} />
      ))}
    </Join>
  )
}

export const OtherWorksFragmentContainer = createFragmentContainer(OtherWorks, {
  artwork: graphql`
    fragment OtherWorks_artwork on Artwork {
      internalID
      slug
      contextGrids {
        __typename
        title
        ctaTitle
        ctaHref
        artworks: artworksConnection(first: 6) {
          edges {
            node {
              id
              slug
              href
              # ...GenericGrid_artworks
              image(includeAll: false) {
                aspectRatio
                blurhash
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
        }
      }
    }
  `,
})
