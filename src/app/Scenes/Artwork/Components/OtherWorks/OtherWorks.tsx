import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Spacer, Box, Text, useSpace, Separator, Join } from "@artsy/palette-mobile"
import { Artwork_artworkBelowTheFold$data } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { OtherWorks_artwork$data } from "__generated__/OtherWorks_artwork.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { filter } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ContextGridCTA } from "./ContextGridCTA"

type OtherWorksGrid = NonNullable<NonNullable<OtherWorks_artwork$data["contextGrids"]>[number]>
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

const ContextGrid: React.FC<{ grid: OtherWorksGrid }> = ({ grid }) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const enableImpressionsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")

  // Only enable impression tracking for RelatedArtworkGrid
  const shouldTrackImpressions =
    enableImpressionsTracking && grid.__typename === "RelatedArtworkGrid"

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    isInViewport: shouldTrackImpressions,
    contextModule: grid.__typename as ContextModule,
    contextScreenOwnerType: OwnerType.artwork,
  })

  return (
    <>
      <Text variant="md" textAlign="left">
        {grid.title}
      </Text>
      <Spacer y={2} />
      <GenericGrid
        trackingFlow={Schema.Flow.RecommendedArtworks}
        contextModule={grid.__typename as ContextModule}
        artworks={extractNodes(grid.artworks)}
        width={width - space(2)}
        {...(shouldTrackImpressions && {
          onViewableItemsChanged,
          viewabilityConfig,
        })}
      />
      <Box mt={2}>
        <ContextGridCTA
          contextModule={grid.__typename}
          href={grid.ctaHref || undefined}
          label={grid.ctaTitle ?? ""}
        />
      </Box>
    </>
  )
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
        <ContextGrid key={`Grid-${index}`} grid={grid} />
      ))}
    </Join>
  )
}

export const OtherWorksFragmentContainer = createFragmentContainer(OtherWorks, {
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
})
