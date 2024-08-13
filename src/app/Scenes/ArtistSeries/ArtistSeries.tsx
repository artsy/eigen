import {
  Spacer,
  Screen,
  Tabs,
  useScreenDimensions,
  Skeleton,
  SkeletonBox,
  Flex,
  SkeletonText,
  Separator,
} from "@artsy/palette-mobile"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { ArtistSeries_artistSeries$key } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { ArtistSeriesArtworks } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { graphql, QueryRenderer, useFragment } from "react-relay"

interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries$key
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const data = useFragment(fragment, props.artistSeries)

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.ArtistSeries,
        context_screen_owner_slug: data.slug,
        context_screen_owner_id: data.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <Tabs.TabsWithHeader
          initialTabName="Artworks"
          title={data?.title}
          showLargeHeaderText={false}
          BelowTitleHeaderComponent={() => (
            <ArtistSeriesHeaderFragmentContainer artistSeries={data} />
          )}
          headerProps={{
            onBack: goBack,
          }}
        >
          <Tabs.Tab name="Artworks" label="Artworks">
            <Tabs.Lazy>
              <ArtistSeriesArtworks artistSeries={data} />
            </Tabs.Lazy>
          </Tabs.Tab>
          <Tabs.Tab name="About" label="About">
            <Tabs.Lazy>
              <Tabs.ScrollView>
                <ArtistSeriesMetaFragmentContainer artistSeries={data} />
              </Tabs.ScrollView>
            </Tabs.Lazy>
          </Tabs.Tab>
        </Tabs.TabsWithHeader>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

const fragment = graphql`
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
`

const ArtistSeriesPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()

  return (
    <Screen>
      <Screen.Header />
      <Screen.Body fullwidth>
        <Skeleton>
          <SkeletonBox width={width} height={250} />
          <Spacer y={2} />
          <Flex px={2}>
            <SkeletonText variant="lg">Artist Series Name</SkeletonText>
          </Flex>

          <Spacer y={2} />

          <Flex px={2} justifyContent="space-between" flexDirection="row">
            <SkeletonText variant="lg">Artist Name</SkeletonText>
            <SkeletonBox width={100} height={40} />
          </Flex>

          <Spacer y={4} />

          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">About</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={4} />

        <PlaceholderGrid />
      </Screen.Body>
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
          Container: ArtistSeries,
          renderPlaceholder: () => <ArtistSeriesPlaceholder />,
        })}
      />
    </ArtworkFiltersStoreProvider>
  )
}
