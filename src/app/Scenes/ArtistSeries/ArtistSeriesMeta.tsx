import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Box } from "@artsy/palette-mobile"
import { ArtistSeriesMeta_artistSeries$data } from "__generated__/ArtistSeriesMeta_artistSeries.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface ArtistSeriesMetaProps {
  artistSeries: ArtistSeriesMeta_artistSeries$data
  relay: RelayProp
}

export const ArtistSeriesMeta: React.FC<ArtistSeriesMetaProps> = ({ artistSeries }) => {
  const metaRef = useRef<View | null>(null)

  const artist = artistSeries.artist?.[0]
  const artistSeriesTotalCount = artist?.artistSeriesConnection?.totalCount ?? 0

  return (
    <>
      <Box my={4} ref={metaRef}>
        <ReadMore testID="description" content={artistSeries?.description ?? ""} maxChars={1000} />
      </Box>
      {artistSeriesTotalCount !== 0 ? (
        <>
          <Box pb={2}>
            <ArtistSeriesMoreSeriesFragmentContainer
              contextModule={ContextModule.moreSeriesByThisArtist}
              contextScreenOwnerId={artistSeries.internalID}
              contextScreenOwnerSlug={artistSeries.slug}
              contextScreenOwnerType={OwnerType.artistSeries}
              artist={artist}
              artistSeriesHeader="More series by this artist"
              currentArtistSeriesExcluded
            />
          </Box>
        </>
      ) : null}
    </>
  )
}

export const ArtistSeriesMetaFragmentContainer = createFragmentContainer(ArtistSeriesMeta, {
  artistSeries: graphql`
    fragment ArtistSeriesMeta_artistSeries on ArtistSeries {
      internalID
      slug
      title
      description
      artist: artists(size: 1) {
        ...ArtistSeriesMoreSeries_artist
        artistSeriesConnection(first: 4) {
          totalCount
        }
      }
    }
  `,
})
