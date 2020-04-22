import { Box } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistCollectionsRailRendererQuery } from "__generated__/ArtistCollectionsRailRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { ArtistCollectionsRailFragmentContainer as ArtistCollectionsRail } from "./ArtistCollectionsRail"

interface Props {
  artistID: ArtistArtworks_artist["internalID"]
}

// Iconic Collections refers to Artist Series rail on Artist pages
export const ArtistCollectionsRailRenderer: React.FC<Props> = ({ artistID }) => {
  return (
    <Box>
      <QueryRenderer<ArtistCollectionsRailRendererQuery>
        environment={defaultEnvironment}
        variables={{
          isFeaturedArtistContent: true,
          size: 16,
          artistID,
        }}
        query={graphql`
          query ArtistCollectionsRailRendererQuery($isFeaturedArtistContent: Boolean, $size: Int, $artistID: String) {
            collections: marketingCollections(
              isFeaturedArtistContent: $isFeaturedArtistContent
              size: $size
              artistID: $artistID
            ) {
              ...ArtistCollectionsRail_collections
            }
          }
        `}
        render={renderWithLoadProgress(ArtistCollectionsRail, { artistID })}
      />
    </Box>
  )
}
