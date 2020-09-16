import { OwnerType } from "@artsy/cohesion"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ProvideScreenTracking } from "lib/utils/track"
import { Box, Spacer, Theme } from "palette"
import React from "react"

import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = ({ artistSeries }) => {
  const artist = artistSeries.artist?.[0]

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.ArtistSeries,
        context_screen_owner_slug: artistSeries.slug,
        context_screen_owner_id: artistSeries.internalID,
      }}
    >
      <Theme>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box px={2}>
            <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
            <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
            <ArtistSeriesArtworksFragmentContainer artistSeries={artistSeries} />
          </Box>
          {
            /* We don't want to see ArtistSeriesMoreSeries or the Separator when there are no related artist series.
            However, this component doesn't have access to the count of related artist series. So, we implement the
            Separator using a border instead, which won't show when there are no children in ArtistSeriesMoreSeries.
          */
            !!artist && (
              <ArtistSeriesMoreSeriesFragmentContainer
                contextScreenOwnerId={artistSeries.internalID}
                contextScreenOwnerSlug={artistSeries.slug}
                contextScreenOwnerType={OwnerType.artistSeries}
                artist={artist}
                borderTopWidth="1px"
                borderTopColor="black10"
                pt={2}
                px={2}
                artistSeriesHeader="More series by this artist"
                currentArtistSeriesExcluded
              />
            )
          }
        </ScrollView>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const ArtistSeriesFragmentContainer = createFragmentContainer(ArtistSeries, {
  artistSeries: graphql`
    fragment ArtistSeries_artistSeries on ArtistSeries {
      internalID
      slug

      artistIDs

      ...ArtistSeriesHeader_artistSeries
      ...ArtistSeriesMeta_artistSeries
      ...ArtistSeriesArtworks_artistSeries

      artist: artists(size: 1) {
        ...ArtistSeriesMoreSeries_artist
      }
    }
  `,
})

const ArtistSeriesPlaceholder: React.FC<{}> = ({}) => {
  return (
    <Theme>
      <Box>
        <Box px="2" pt="1">
          {/* Series header image */}
          <PlaceholderBox height={180} width={180} alignSelf="center" />
          <Spacer mb={2} />
          {/* Artist Series name */}
          <PlaceholderText width={220} />
          {/* Artist series info */}
          <PlaceholderText width={190} />
          <PlaceholderText width={190} />
        </Box>
        <Spacer mb={2} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Box>
    </Theme>
  )
}

export const ArtistSeriesQueryRenderer: React.SFC<{ artistSeriesID: string }> = ({ artistSeriesID }) => {
  return (
    <QueryRenderer<ArtistSeriesQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistSeriesQuery($artistSeriesID: ID!) {
          artistSeries(id: $artistSeriesID) {
            ...ArtistSeries_artistSeries
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistSeriesID,
      }}
      render={renderWithPlaceholder({
        Container: ArtistSeriesFragmentContainer,
        renderPlaceholder: () => <ArtistSeriesPlaceholder />,
      })}
    />
  )
}
