import { Spacer, Box, Screen, Tabs } from "@artsy/palette-mobile"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { ArtistSeries_artistSeries$data } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { ArtistSeriesArtworksFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries$data
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const { artistSeries } = props

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.ArtistSeries,
        context_screen_owner_slug: artistSeries.slug,
        context_screen_owner_id: artistSeries.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <Tabs.TabsWithHeader
          initialTabName="Artworks"
          title={artistSeries?.title}
          showLargeHeaderText={false}
          BelowTitleHeaderComponent={() => (
            <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
          )}
          headerProps={{
            onBack: goBack,
          }}
        >
          <Tabs.Tab name="Artworks" label="Artworks">
            <ArtistSeriesArtworksFragmentContainer artistSeries={artistSeries} />
          </Tabs.Tab>
          <Tabs.Tab name="About" label="About">
            <Tabs.ScrollView>
              <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
            </Tabs.ScrollView>
          </Tabs.Tab>
        </Tabs.TabsWithHeader>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

// clean me up / make me pretty update me to be a hook
export const ArtistSeriesFragmentContainer = createFragmentContainer(ArtistSeries, {
  artistSeries: graphql`
    fragment ArtistSeries_artistSeries on ArtistSeries {
      internalID
      slug
      title
      artistIDs

      ...ArtistSeriesHeader_artistSeries
      ...ArtistSeriesMeta_artistSeries
      ...ArtistSeriesArtworks_artistSeries @arguments(input: { sort: "-decayed_merch" })

      artist: artists(size: 1) {
        ...ArtistSeriesMoreSeries_artist
        artistSeriesConnection(first: 4) {
          totalCount
        }
      }
    }
  `,
})

const ArtistSeriesPlaceholder: React.FC<{}> = ({}) => {
  // TODO: fix me bitte
  return (
    <Screen>
      <Screen.Header />
      <Box>
        <Box px={2}>
          {/* Series header image */}
          <PlaceholderBox height={180} width={180} alignSelf="center" />
          <Spacer y={2} />
          {/* Artist Series name */}
          <PlaceholderText width={220} />
          {/* Artist series info */}
          <PlaceholderText width={190} />
          <PlaceholderText width={190} />
        </Box>
        <Spacer y={2} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Box>
    </Screen>
  )
}

export const ArtistSeriesQueryRenderer: React.FC<{ artistSeriesID: string }> = ({
  artistSeriesID,
}) => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<ArtistSeriesQuery>
        environment={getRelayEnvironment()}
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
    </ArtworkFiltersStoreProvider>
  )
}
