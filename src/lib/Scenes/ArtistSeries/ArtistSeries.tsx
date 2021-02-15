import { OwnerType } from "@artsy/cohesion"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Box, Separator, Spacer, Theme } from "palette"
import React, { useRef, useState } from "react"

import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { FlatList, View, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
}

interface ViewableItems {
  viewableItems?: ViewToken[]
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const { artistSeries } = props
  const tracking = useTracking()
  const flatListRef = useRef<FlatList>(null)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)

  const artist = artistSeries.artist?.[0]

  const sections = ["artistSeriesHeader", "artistSeriesMeta", "artistSeriesArtworks", "artistSeriesMoreSeries"]
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 30 })

  const viewableItemsChangedRef = React.useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item === "artistSeriesArtworks"
    })
    setArtworksGridVisible(artworksItem?.isViewable ?? false)
  })

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
      <ArtworkFilterGlobalStateProvider>
        <ArtworkFilterContext.Consumer>
          {() => (
            <Theme>
              <View style={{ flex: 1 }}>
                <FlatList
                  ref={flatListRef}
                  viewabilityConfig={viewConfigRef.current}
                  onViewableItemsChanged={viewableItemsChangedRef.current}
                  keyExtractor={(_item, index) => String(index)}
                  data={sections}
                  ItemSeparatorComponent={() => <Spacer mb="2" />}
                  renderItem={({ item }): null | any => {
                    switch (item) {
                      case "artistSeriesHeader":
                        return (
                          <Box px="2">
                            <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
                          </Box>
                        )
                      case "artistSeriesMeta":
                        return (
                          <Box px="2" pt="1">
                            <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
                          </Box>
                        )
                      case "artistSeriesArtworks":
                        return (
                          <Box px="2">
                            <ArtistSeriesArtworksFragmentContainer artistSeries={artistSeries} />
                            <FilterModalNavigator
                              {...props}
                              isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                              id={artistSeries.internalID}
                              slug={artistSeries.slug}
                              mode={FilterModalMode.ArtistSeries}
                              exitModal={handleFilterArtworksModal}
                              closeModal={closeFilterArtworksModal}
                            />
                          </Box>
                        )
                      case "artistSeriesMoreSeries":
                        return (
                          !((artist?.artistSeriesConnection?.totalCount ?? 0) === 0) && (
                            <>
                              <Separator mb="2" />
                              <Box px="2" pb="2">
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
                          )
                        )
                    }
                  }}
                />
                <AnimatedArtworkFilterButton isVisible={isArtworksGridVisible} onPress={openFilterArtworksModal} />
              </View>
            </Theme>
          )}
        </ArtworkFilterContext.Consumer>
      </ArtworkFilterGlobalStateProvider>
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
          <Spacer mb="2" />
          {/* Artist Series name */}
          <PlaceholderText width={220} />
          {/* Artist series info */}
          <PlaceholderText width={190} />
          <PlaceholderText width={190} />
        </Box>
        <Spacer mb="2" />
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
