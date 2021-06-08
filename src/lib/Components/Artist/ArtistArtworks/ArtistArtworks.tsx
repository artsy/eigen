import { OwnerType } from "@artsy/cohesion"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistArtworks_me } from "__generated__/ArtistArtworks_me.graphql"
import { ArtistArtworksContainerCreateSavedSearchMutation } from "__generated__/ArtistArtworksContainerCreateSavedSearchMutation.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
  prepareFilterParamsForSaveSearchInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Button, FilterIcon, Flex, Separator, Spacer, Text, Touchable } from "palette"
import React, { useContext, useEffect, useState } from "react"
import {
  commitMutation,
  createPaginationContainer,
  createRefetchContainer,
  graphql,
  RelayPaginationProp,
  RelayRefetchProp,
} from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  relay: RelayPaginationProp
  me: ArtistArtworks_me
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, me, ...props }) => {
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

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

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView>
        <ArtistArtworksContainer
          {...props}
          me={me}
          artist={artist}
          relay={relay}
          openFilterModal={openFilterArtworksModal}
        />
        <ArtworkFilterNavigator
          {...props}
          id={artist.internalID}
          slug={artist.slug}
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          exitModal={handleFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.ArtistArtworks}
        />
      </StickyTabPageScrollView>
    </ArtworkFiltersStoreProvider>
  )
}
interface ArtistArtworksContainerProps {
  openFilterModal: () => void
}

const ArtistArtworksContainer: React.FC<ArtworksGridProps & ArtistArtworksContainerProps> = ({
  artist,
  relay,
  openFilterModal,
  me,
  ...props
}) => {
  const tracking = useTracking()
  const enableSavedSearch = useFeatureFlag("AREnableSavedSearch")
  const [isSavedSearch, setIsSavedSearch] = useState(false)
  const [savingFilterSearch, setSavingFilterSearch] = useState(false)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const shouldShowSavedSearchBanner = enableSavedSearch && appliedFilters.length > 0

  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)

  const filterParams = filterArtworksParams(appliedFilters)
  const artworks = artist.artworks
  const artworksCount = artworks?.edges?.length
  const artworksTotal = artworks?.counts?.total

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("ArtistArtworks/ArtistArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    setAggregationsAction(artworks?.aggregations)
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

  const createSavedSearch = () => {
    const input = prepareFilterParamsForSaveSearchInput(filterParams)

    setSavingFilterSearch(true)
    commitMutation<ArtistArtworksContainerCreateSavedSearchMutation>(relay.environment, {
      mutation: graphql`
        mutation ArtistArtworksContainerCreateSavedSearchMutation($input: CreateSavedSearchInput!) {
          createSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          attributes: {
            artistID: artist.internalID,
            ...input,
          },
        },
      },
      onCompleted: () => {
        setSavingFilterSearch(false)
      },
      onError: () => {
        setSavingFilterSearch(false)
      },
    })
  }

  const handleSaveSearchFiltersPress = () => {
    if (savingFilterSearch) {
      return
    }

    const nextIsSavedSearchState = !isSavedSearch

    if (nextIsSavedSearchState) {
      createSavedSearch()
    }

    setIsSavedSearch(nextIsSavedSearchState)
  }

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX
  const screenWidth = useScreenDimensions().width

  useEffect(
    () =>
      setJSX(
        <Box backgroundColor="white" mt={2} px={2}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text variant="subtitle" color="black60">
              Showing {artworksTotal} works
            </Text>
            <Touchable haptic onPress={openFilterModal}>
              <Flex flexDirection="row">
                <FilterIcon fill="black100" width="20px" height="20px" />
                <Text variant="subtitle" color="black100">
                  Sort & Filter
                </Text>
              </Flex>
            </Touchable>
          </Flex>
          <Separator mt={2} ml={-2} width={screenWidth} />
          {!!shouldShowSavedSearchBanner && (
            <>
              <SavedSearchBannerContainer
                me={me}
                enabled={isSavedSearch}
                onPress={handleSaveSearchFiltersPress}
                loading={savingFilterSearch}
              />
              <Separator ml={-2} width={screenWidth} />
            </>
          )}
        </Box>
      ),
    [artworksTotal, shouldShowSavedSearchBanner, isSavedSearch, savingFilterSearch]
  )

  const filteredArtworks = () => {
    if (artworksCount === 0) {
      return (
        <Box mb="80px" pt={1}>
          <FilteredArtworkGridZeroState id={artist.id} slug={artist.slug} trackClear={trackClear} />
        </Box>
      )
    } else {
      return (
        <>
          <Spacer mb={1} />
          <InfiniteScrollArtworksGrid
            connection={artist.artworks!}
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            {...props}
            contextScreenOwnerType={OwnerType.artist}
            contextScreenOwnerId={artist.internalID}
            contextScreenOwnerSlug={artist.slug}
          />
        </>
      )
    }
  }

  return artist.artworks ? filteredArtworks() : null
}

interface SavedSearchBannerProps {
  loading?: boolean
  onPress: () => void
  relay: RelayRefetchProp
  me: ArtistArtworks_me
}

const SavedSearchBanner: React.FC<SavedSearchBannerProps> = ({ loading, onPress, relay, me }) => {
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterParams = filterArtworksParams(appliedFilters)
  const parameterised = prepareFilterArtworksParamsForInput(filterParams)

  const [buttonEnabled, setButtonEnabled] = useState<boolean>(!!me.savedSearch?.internalID)

  console.log("ME NAME", me.name)

  useEffect(() => {
    relay.refetch(
      { criteria: parameterised },
      null,
      () => {
        setButtonEnabled(!!me.savedSearch?.internalID)
      },
      { force: true }
    )
  }, [appliedFilters])

  return (
    <Flex
      backgroundColor="white"
      flexDirection="row"
      mx={-2}
      px={2}
      py={11}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text variant="small" color="black">
        New works alert for this search
      </Text>
      <Button
        variant={buttonEnabled ? "secondaryOutline" : "primaryBlack"}
        onPress={onPress}
        size="small"
        loading={loading}
        longestText="Disable"
        haptic
      >
        {buttonEnabled ? "Disable" : "Enable"}
      </Button>
    </Flex>
  )
}

export const SavedSearchBannerContainer = createRefetchContainer(
  SavedSearchBanner,
  {
    me: graphql`
      fragment ArtistArtworks_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        name
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query ArtistArtworksRefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...ArtistArtworks_me @arguments(criteria: $criteria)
      }
    }
  `
)

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        slug
        internalID
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          input: $input
          aggregations: [
            COLOR
            DIMENSION_RANGE
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
            PRICE_RANGE
          ]
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
          counts {
            total
          }
          ...InfiniteScrollArtworksGrid_connection
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
        id: props.artist.id,
        input: fragmentVariables.input,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtistArtworksQuery($id: ID!, $count: Int!, $cursor: String, $input: FilterArtworksInput) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)
