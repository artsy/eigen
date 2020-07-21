import { Box, Spacer, Theme } from "@artsy/palette"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"

import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = ({ artistSeries }) => {
  return (
    <Theme>
      <Box px={2}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
          <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
          <ArtistSeriesArtworksFragmentContainer artistSeries={artistSeries} />
        </ScrollView>
      </Box>
    </Theme>
  )
}

export const ArtistSeriesFragmentContainer = createFragmentContainer(ArtistSeries, {
  artistSeries: graphql`
    fragment ArtistSeries_artistSeries on ArtistSeries {
      ...ArtistSeriesHeader_artistSeries
      ...ArtistSeriesMeta_artistSeries
      ...ArtistSeriesArtworks_artistSeries
    }
  `,
})

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
      render={renderWithLoadProgress(ArtistSeriesFragmentContainer)}
    />
  )
}
