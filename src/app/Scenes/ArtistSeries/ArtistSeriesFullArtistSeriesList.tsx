import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistSeriesFullArtistSeriesList_artist$data } from "__generated__/ArtistSeriesFullArtistSeriesList_artist.graphql"
import { ArtistSeriesFullArtistSeriesListQuery } from "__generated__/ArtistSeriesFullArtistSeriesListQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { Box, Flex, Sans } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface FullArtistSeriesListProps {
  artist: ArtistSeriesFullArtistSeriesList_artist$data
}

export const FullArtistSeriesList: React.FC<FullArtistSeriesListProps> = ({ artist }) => {
  const seriesList = artist?.artistSeriesConnection?.edges ?? []

  if (!artist || seriesList.length === 0) {
    return null
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.AllArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.AllArtistSeries,
      }}
    >
      <ScrollView>
        <Box px="2" py="2">
          <Sans size="4" weight="medium" textAlign="center">
            Artist Series
          </Sans>
        </Box>
        {seriesList.map((series, index) => (
          <Flex key={series?.node?.internalID ?? index} flexDirection="row" mb={1} px={2}>
            <ArtistSeriesListItem
              listItem={series}
              contextModule={ContextModule.artistSeriesRail}
              contextScreenOwnerType={OwnerType.allArtistSeries}
              horizontalSlidePosition={index}
            />
          </Flex>
        ))}
      </ScrollView>
    </ProvideScreenTracking>
  )
}

export const ArtistSeriesFullArtistSeriesListFragmentContainer = createFragmentContainer(
  FullArtistSeriesList,
  {
    artist: graphql`
      fragment ArtistSeriesFullArtistSeriesList_artist on Artist {
        artistSeriesConnection(first: 50) {
          edges {
            node {
              slug
              internalID
              title
              featured
              artworksCountMessage
              image {
                url
              }
            }
          }
        }
      }
    `,
  }
)

export const ArtistSeriesFullArtistSeriesListQueryRenderer: React.FC<{ artistID: string }> = ({
  artistID,
}) => {
  return (
    <QueryRenderer<ArtistSeriesFullArtistSeriesListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistSeriesFullArtistSeriesListQuery($artistID: String!) {
          artist(id: $artistID) {
            ...ArtistSeriesFullArtistSeriesList_artist
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistID,
      }}
      render={renderWithLoadProgress(ArtistSeriesFullArtistSeriesListFragmentContainer)}
    />
  )
}
