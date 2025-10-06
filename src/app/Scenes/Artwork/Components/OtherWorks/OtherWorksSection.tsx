import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { OtherWorks_artwork$data } from "__generated__/OtherWorks_artwork.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { ContextGridCTA } from "app/Scenes/Artwork/Components/OtherWorks/ContextGridCTA"
import { OtherWorksGrid } from "app/Scenes/Artwork/Components/OtherWorks/OtherWorks"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"

// This would be better controlled from the backend
export const GRID_TO_TRACK = "Related works"

export const OtherWorksSection: React.FC<{
  grid: OtherWorksGrid
  index: number
  artwork: OtherWorks_artwork$data
}> = ({ grid, index, artwork }) => {
  return (
    <React.Fragment key={`Grid-${index}`}>
      <Text variant="md" textAlign="left">
        {grid.title}
      </Text>

      <Spacer y={2} />

      <Flex
        // We are setting a negative margin to the flex container to offset the default margin
        // of the masonry grid items
        mx={-2}
      >
        <MasonryInfiniteScrollArtworkGrid
          artworks={extractNodes(grid.artworks)}
          loadMore={() => {}}
          hasMore={false}
          numColumns={2}
          contextModule={grid.__typename as ContextModule}
          contextScreenOwnerType={OwnerType.artwork}
          nestedScrollEnabled={false}
          contextScreenOwnerId={artwork.internalID}
          contextScreenOwnerSlug={artwork.slug}
          enableImpressionsTracking={grid.title === GRID_TO_TRACK}
        />
      </Flex>

      <Box mt={2}>
        <ContextGridCTA
          contextModule={grid.__typename}
          href={grid.ctaHref || undefined}
          label={grid.ctaTitle ?? ""}
        />
      </Box>
    </React.Fragment>
  )
}
