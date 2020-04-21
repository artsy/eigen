import { Box } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistSeriesRailQueryRendererQuery } from "__generated__/ArtistSeriesRailQueryRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { ArtistSeriesRailFragmentContainer as ArtistSeriesRail } from "./ArtistSeriesRail"

interface Props {
  artistID: ArtistArtworks_artist["internalID"]
}

export const ArtistSeriesRailQueryRenderer: React.FC<Props> = ({ artistID }) => {
  return (
    <Box>
      <QueryRenderer<ArtistSeriesRailQueryRendererQuery>
        environment={defaultEnvironment}
        variables={{
          isFeaturedArtistContent: true,
          size: 5,
          artistID,
        }}
        query={graphql`
          query ArtistSeriesRailQueryRendererQuery($isFeaturedArtistContent: Boolean, $size: Int, $artistID: String) {
            collections: marketingCollections(
              isFeaturedArtistContent: $isFeaturedArtistContent
              size: $size
              artistID: $artistID
            ) {
              ...ArtistSeriesRail_collections
            }
          }
        `}
        render={renderWithLoadProgress(ArtistSeriesRail, { artistID })}
      />
    </Box>
  )
}
