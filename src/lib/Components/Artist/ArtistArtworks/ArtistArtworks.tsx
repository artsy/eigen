import { ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistNotableWorksRailFragmentContainer } from "lib/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import {
  AnimatedArtworkFilterButton,
  FilterModalMode,
  FilterModalNavigator,
} from "lib/Components/FilterModal/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { Box, Flex, Separator, Spacer } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistCollectionsRailFragmentContainer } from "./ArtistCollectionsRail"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  relay: RelayPaginationProp
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isArtworksGridVisible, setArtworksGridVisible] = useState(false)

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: artist.id,
      context_screen_owner_slug: artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: artist.id,
      context_screen_owner_slug: artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const onViewRef = React.useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item === "filteredArtworks"
    })
    setArtworksGridVisible(artworksItem?.isViewable ?? false)
  })

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 25 })

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {() => (
          <>
            <StickyTabPageScrollView>
              <ArtistArtworksContainer
                {...props}
                viewableItemsRef={onViewRef}
                viewConfigRef={viewConfigRef}
                artist={artist}
                relay={relay}
              />
              <FilterModalNavigator
                {...props}
                id={artist.id}
                slug={artist.slug}
                isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                exitModal={handleFilterArtworksModal}
                closeModal={closeFilterArtworksModal}
                mode={FilterModalMode.ArtistArtworks}
              />
            </StickyTabPageScrollView>
            <AnimatedArtworkFilterButton isVisible={isArtworksGridVisible} onPress={openFilterArtworksModal} />
          </>
        )}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

// Types related to showing filter button on scroll
interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: any
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

interface ViewableItemRefs {
  viewableItemsRef: React.MutableRefObject<(viewableItems: ViewableItems) => void>
  viewConfigRef: React.MutableRefObject<{ viewAreaCoveragePercentThreshold: number }>
}

const ArtistArtworksContainer: React.FC<ArtworksGridProps & ViewableItemRefs> = ({
  artist,
  viewableItemsRef,
  viewConfigRef,
  relay,
  ...props
}) => {
  const tracking = useTracking()
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)
  const artworks = artist.artworks
  const artworksTotal = artworks?.edges?.length
  const shouldShowCollections = artist.iconicCollections && artist.iconicCollections.length > 1
  const shouldShowNotables = artist.notableWorks?.edges?.length === 3
  const shouldShowArtistSeries = useFeatureFlag("AROptionsArtistSeries")

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("ArtistArtworks/ArtistArtworks filter error: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: artworks?.aggregations,
    })
  }, [])

  // TODO: Convert to use cohesion
  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const filteredArtworks = () => {
    if (artworksTotal === 0) {
      return (
        <Box mb={80} pt="1">
          <FilteredArtworkGridZeroState id={artist.id} slug={artist.slug} trackClear={trackClear} />
        </Box>
      )
    } else {
      return (
        <>
          <Spacer mb="2" />
          <InfiniteScrollArtworksGrid
            connection={artist.artworks!}
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            {...props}
            contextScreenOwnerType={OwnerType.artist}
            contextScreenOwnerId={artist.internalID}
            contextScreenOwnerSlug={artist.slug}
          />
          <Flex
            alignItems="center"
            justifyContent="center"
            p="3"
            pb="9"
            style={{ opacity: relay.isLoading() && relay.hasMore() ? 1 : 0 }}
          >
            <ActivityIndicator />
          </Flex>
        </>
      )
    }
  }

  const sections = [
    ...(shouldShowArtistSeries ? ["topArtistSeries"] : []),
    ...(shouldShowNotables ? ["notableWorks"] : []),
    ...(shouldShowCollections ? ["collections"] : []),
    ...(shouldShowCollections || shouldShowNotables ? ["separator"] : []),
    "filteredArtworks",
  ]

  return artist.artworks ? (
    <FlatList
      data={sections}
      onViewableItemsChanged={viewableItemsRef.current}
      viewabilityConfig={viewConfigRef.current}
      keyExtractor={(_item, index) => String(index)}
      renderItem={({ item }): null | any => {
        switch (item) {
          case "topArtistSeries":
            return (
              <ArtistSeriesMoreSeriesFragmentContainer
                contextScreenOwnerId={artist.internalID}
                contextScreenOwnerSlug={artist.slug}
                contextScreenOwnerType={OwnerType.artist}
                contextModule={ContextModule.artistSeriesRail}
                artist={artist}
                artistSeriesHeader="Top Artist Series"
                mt="2"
              />
            )
          case "notableWorks":
            return <ArtistNotableWorksRailFragmentContainer artist={artist} {...props} />
          case "collections":
            return (
              <ArtistCollectionsRailFragmentContainer
                collections={artist.iconicCollections}
                artist={artist}
                {...props}
              />
            )
          case "separator":
            return (
              <Box m="-2" mb="1" mt="1">
                <Separator />
              </Box>
            )

          case "filteredArtworks":
            return filteredArtworks()
        }
      }}
    />
  ) : null
}

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        sort: { type: "String", defaultValue: "-decayed_merch" }
        medium: { type: "String", defaultValue: "*" }
        priceRange: { type: "String" }
        color: { type: "String" }
        partnerID: { type: "ID" }
        dimensionRange: { type: "String", defaultValue: "*-*" }
        majorPeriods: { type: "[String]" }
        acquireable: { type: "Boolean" }
        inquireableOnly: { type: "Boolean" }
        atAuction: { type: "Boolean" }
        offerable: { type: "Boolean" }
        attributionClass: { type: "[String]" }
      ) {
        id
        slug
        internalID
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          sort: $sort
          medium: $medium
          priceRange: $priceRange
          color: $color
          partnerID: $partnerID
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
          attributionClass: $attributionClass
        ) @connection(key: "ArtistArtworksGrid_artworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }

        ...ArtistCollectionsRail_artist

        iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
          ...ArtistCollectionsRail_collections
        }

        ...ArtistNotableWorksRail_artist

        ...ArtistSeriesMoreSeries_artist

        # this should match the query in ArtistNotableWorksRail
        notableWorks: filterArtworksConnection(sort: "-weighted_iconicity", first: 3) {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.artist && props.artist.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.artist.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtistArtworksQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $priceRange: String
        $color: String
        $partnerID: ID
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
        $attributionClass: [String]
      ) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist
              @arguments(
                count: $count
                cursor: $cursor
                sort: $sort
                medium: $medium
                color: $color
                partnerID: $partnerID
                priceRange: $priceRange
                dimensionRange: $dimensionRange
                majorPeriods: $majorPeriods
                acquireable: $acquireable
                inquireableOnly: $inquireableOnly
                atAuction: $atAuction
                offerable: $offerable
                attributionClass: $attributionClass
              )
          }
        }
      }
    `,
  }
)
