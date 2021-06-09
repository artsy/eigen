import { OwnerType } from "@artsy/cohesion"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { StickyHeaderPage } from "lib/Components/StickyHeaderPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Box, FilterIcon, Flex, Separator, Spacer, Text, Theme, Touchable } from "palette"
import React, { useState } from "react"

import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const { artistSeries } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

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
      <ArtworkFiltersStoreProvider>
        <Theme>
          <StickyHeaderPage
            headerContent={(
              <>
                <Flex px={2}>
                  <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
                  <Spacer mt={2} mb={1} />
                  <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
                </Flex>
                <Separator mt={2} mb={1} />
              </>
            )}
            footerContent={artistSeriesTotalCount !== 0 ? (
              <>
                <Separator mb={2} />
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
            stickyHeaderContent={(
              <Box backgroundColor="white100" py={1}>
                <Flex flexDirection="row" px={2} justifyContent="space-between" alignItems="center">
                  <Text variant="subtitle" color="black60">
                    Showing 100 works
                  </Text>
                  <Touchable haptic onPress={openFilterArtworksModal}>
                    <Flex flexDirection="row">
                      <FilterIcon fill="black100" width="20px" height="20px" />
                      <Text variant="subtitle" color="black100">
                        Sort & Filter
                      </Text>
                    </Flex>
                  </Touchable>
                </Flex>
                <Spacer mb={1} />
              </Box>
            )}
          >
            <Flex px={2}>
              <ArtistSeriesArtworksFragmentContainer
                artistSeries={artistSeries}
                openFilterModal={openFilterArtworksModal}
              />
              <ArtworkFilterNavigator
                {...props}
                isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                id={artistSeries.internalID}
                slug={artistSeries.slug}
                mode={FilterModalMode.ArtistSeries}
                exitModal={handleFilterArtworksModal}
                closeModal={closeFilterArtworksModal}
              />
            </Flex>
          </StickyHeaderPage>
        </Theme>
      </ArtworkFiltersStoreProvider>
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
      ...ArtistSeriesArtworks_artistSeries @arguments(input: {
        sort: "-decayed_merch",
        dimensionRange: "*-*"
      })

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

export const ArtistSeriesQueryRenderer: React.FC<{ artistSeriesID: string }> = ({ artistSeriesID }) => {
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
