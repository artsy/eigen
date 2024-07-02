import { OwnerType } from "@artsy/cohesion"
import { Spacer, Flex, Box, Text, Separator, Screen } from "@artsy/palette-mobile"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { ArtistSeries_artistSeries$data } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { ArtistSeriesArtworksFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { useConditionalGoBack } from "app/system/newNavigation/useConditionalGoBack"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import React, { useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries$data
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const { artistSeries } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const selectedFiltersCount = useSelectedFiltersCount()
  const artworksTotal = ArtworksFiltersStore.useStoreState((state) => state.counts.total) ?? 0
  const goBack = useConditionalGoBack()
  const artist = artistSeries.artist?.[0]
  const artistSeriesTotalCount = artist?.artistSeriesConnection?.totalCount ?? 0

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.ArtistSeries,
        context_screen_owner_slug: artistSeries.slug,
        context_screen_owner_id: artistSeries.internalID,
      }}
    >
      <Screen>
        <Screen.Header onBack={goBack} />
        <ScrollView keyboardShouldPersistTaps="handled" stickyHeaderIndices={[1]}>
          <>
            <Flex px={2}>
              <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
              <Spacer y={2} />
              <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
            </Flex>
            <Separator mt={2} />
          </>
          {/* sticky ~ START ~ If you are rearanging the contents of the scrollview
          make sure to adjust the stickyHeaderIndices to reflect which one
          is the sticky component */}
          <Flex backgroundColor="white">
            <ArtworksFilterHeader
              selectedFiltersCount={selectedFiltersCount}
              onFilterPress={openFilterArtworksModal}
            />
          </Flex>

          {/* sticky ~ END */}
          <Flex px={2} mt={2}>
            <Text variant="sm-display" color="black60" mb={2}>
              Showing {artworksTotal} works
            </Text>
            <ArtistSeriesArtworksFragmentContainer artistSeries={artistSeries} />
            <ArtworkFilterNavigator
              {...props}
              visible={isFilterArtworksModalVisible}
              id={artistSeries.internalID}
              slug={artistSeries.slug}
              mode={FilterModalMode.ArtistSeries}
              exitModal={handleFilterArtworksModal}
              closeModal={closeFilterArtworksModal}
            />
          </Flex>
          {artistSeriesTotalCount !== 0 ? (
            <>
              <Separator mb={1} />
              <Box pb={2} px={2}>
                <ArtistSeriesMoreSeriesFragmentContainer
                  contextScreenOwnerId={artistSeries.internalID}
                  contextScreenOwnerSlug={artistSeries.slug}
                  contextScreenOwnerType={OwnerType.artistSeries}
                  artist={artist}
                  artistSeriesHeader="More series by this artist"
                  currentArtistSeriesExcluded
                />
              </Box>
            </>
          ) : undefined}
        </ScrollView>
      </Screen>
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
