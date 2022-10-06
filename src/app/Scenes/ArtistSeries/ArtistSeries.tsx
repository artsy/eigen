import { OwnerType } from "@artsy/cohesion"
import { ArtistSeries_artistSeries$data } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { StickyHeaderPage } from "app/Components/StickyHeaderPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import React, { useState } from "react"
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
      <StickyHeaderPage
        headerContent={
          <>
            <Flex px={2}>
              <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
              <Spacer mt={2} mb={1} />
              <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
            </Flex>
            <Separator mt={2} />
          </>
        }
        footerContent={
          artistSeriesTotalCount !== 0 ? (
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
          ) : undefined
        }
        stickyHeaderContent={
          <Flex backgroundColor="white">
            <ArtworksFilterHeader
              selectedFiltersCount={selectedFiltersCount}
              onFilterPress={openFilterArtworksModal}
            />
          </Flex>
        }
        keyboardShouldPersistTaps="handled"
      >
        <Flex px={2} mt={2}>
          <Text variant="md" color="black60" mb={2}>
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
      </StickyHeaderPage>
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
  )
}

export const ArtistSeriesQueryRenderer: React.FC<{ artistSeriesID: string }> = ({
  artistSeriesID,
}) => {
  return (
    <ArtworkFiltersStoreProvider>
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
    </ArtworkFiltersStoreProvider>
  )
}
