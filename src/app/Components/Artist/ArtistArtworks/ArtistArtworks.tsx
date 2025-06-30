import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  BellIcon,
  Box,
  Button,
  Flex,
  Message,
  SkeletonText,
  Spacer,
  Tabs,
  Text,
  useColor,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { MasonryFlashListRef } from "@shopify/flash-list"
import {
  ArtistArtworksQuery,
  ArtistArtworksQuery$data,
  FilterArtworksInput,
} from "__generated__/ArtistArtworksQuery.graphql"
import { ArtistArtworks_artist$key } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistArtworks_artistAggregation$key } from "__generated__/ArtistArtworks_artistAggregation.graphql"
import { ArtistArtworksFilterHeader } from "app/Components/Artist/ArtistArtworks/ArtistArtworksFilterHeader"
import { useCreateSavedSearchModalFilters } from "app/Components/Artist/ArtistArtworks/hooks/useCreateSavedSearchModalFilters"
import { useShowArtworksFilterModal } from "app/Components/Artist/ArtistArtworks/hooks/useShowArtworksFilterModal"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { Aggregations, FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_ARTWORK_SORTS } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { convertSavedSearchCriteriaToFilterParams } from "app/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { Props as InfiniteScrollGridProps } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { LoadFailureView, LoadFailureViewProps } from "app/Components/LoadFailureView"
import { ProgressiveOnboardingAlertReminder } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingAlertReminder"
import {
  CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD,
  useDismissAlertReminder,
} from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { CreateSavedSearchModal } from "app/Scenes/SavedSearchAlert/CreateSavedSearchModal"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksGridProps extends InfiniteScrollGridProps, ArtistArtworksQueryRendererProps {
  artist: NonNullable<ArtistArtworksQuery$data["artist"]>
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({
  artist: artistProp,
  predefinedFilters,
  scrollToArtworksGrid,
  searchCriteria,
  ...props
}) => {
  const color = useColor()
  const {
    data: artist,
    loadNext,
    hasNext,
    isLoadingNext,
    refetch,
  } = usePaginationFragment<ArtistArtworksQuery, ArtistArtworks_artist$key>(
    artistArtworksFragment,
    artistProp
  )

  const artistArtworksAggregations = useFragment<ArtistArtworks_artistAggregation$key>(
    artistAggregation,
    artistProp
  )

  const [isCreateAlertModalVisible, setIsCreateAlertModalVisible] = useState(false)
  const { showFilterArtworksModal, closeFilterArtworksModal } = useShowArtworksFilterModal({
    artist,
  })
  const tracking = useTracking()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const showCreateAlertAtEndOfList = useFeatureFlag("ARShowCreateAlertInArtistArtworksListFooter")
  const artworks = useMemo(() => extractNodes(artist.artworks), [artist.artworks])

  const artworksCount = artist.artworks?.counts?.total ?? 0
  const gridRef = useRef<MasonryFlashListRef<(typeof artworks)[0]>>(null)

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const { dismissAllCreateAlertReminder } = useDismissAlertReminder()

  useArtworkFilters({
    refetch,
    aggregations: artistArtworksAggregations.aggregations?.aggregations,
    componentPath: "ArtistArtworks/ArtistArtworks",
    pageSize: MASONRY_LIST_PAGE_SIZE,
  })

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setInitialFilterStateAction
  )

  useEffect(() => {
    let filters: FilterArray = []

    if (Array.isArray(predefinedFilters)) {
      filters = predefinedFilters
    }

    if (searchCriteria && artistArtworksAggregations.aggregations?.aggregations) {
      const params = convertSavedSearchCriteriaToFilterParams(
        searchCriteria,
        artistArtworksAggregations.aggregations.aggregations as Aggregations
      )
      const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
        (sortEntity) => sortEntity.paramValue === "-published_at"
      )

      filters = [...params, ...(Array.isArray(sortFilterItem) ? sortFilterItem : [])]
    }

    setInitialFilterStateAction(filters)
  }, [])

  useEffect(() => {
    if (scrollToArtworksGrid) {
      setTimeout(() => {
        gridRef.current?.scrollToOffset({ offset: -20, animated: true })
      }, 1000)
    }
  }, [scrollToArtworksGrid])

  const { savedSearchEntity, attributes, sizeMetric } = useCreateSavedSearchModalFilters({
    entityId: artist.internalID,
    entityName: artist.name ?? "",
    entitySlug: artist.slug,
    entityOwnerType: OwnerType.artist,
  })

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

  const handleCompleteSavedSearch = () => {
    // TODO: Get the new count of the artist alerts
  }

  const loadMore = () => {
    if (hasNext && !isLoadingNext) {
      loadNext(MASONRY_LIST_PAGE_SIZE)
    }
  }

  const CreateAlertButton: React.FC<{ contextModule: ContextModule }> = ({ contextModule }) => {
    const { trackCreateAlertTap } = useCreateAlertTracking({
      contextScreenOwnerType: OwnerType.artist,
      contextScreenOwnerId: artist.internalID,
      contextScreenOwnerSlug: artist.slug,
      contextModule: contextModule,
    })

    return (
      <Button
        variant="outline"
        mx="auto"
        icon={<BellIcon />}
        size="small"
        onPress={() => {
          trackCreateAlertTap()
          setIsCreateAlertModalVisible(true)
        }}
      >
        Create Alert
      </Button>
    )
  }

  const renderItem = useCallback(({ item, index, columnIndex }) => {
    const imgAspectRatio = item.image?.aspectRatio ?? 1
    const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
    const imgHeight = imgWidth / imgAspectRatio

    return (
      <Flex
        pl={columnIndex === 0 ? 0 : 1}
        pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
        mt={2}
      >
        <ArtworkGridItem
          {...props}
          itemIndex={index}
          contextScreenOwnerType={OwnerType.artist}
          contextScreenOwnerId={artist.internalID}
          contextScreenOwnerSlug={artist.slug}
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  if (!artist.statuses?.artworks) {
    return (
      <Tabs.ScrollView>
        <Spacer y={6} />

        <Text variant="md" textAlign="center">
          Get notified when new works are available
        </Text>

        <Text variant="md" textAlign="center" color="mono60">
          There are currently no works for sale for this artist. Create an alert, and we’ll let you
          know when new works are added.
        </Text>

        <Spacer y={2} />

        <CreateAlertButton contextModule={ContextModule.artworkGridEmptyState} />

        <Spacer y={6} />

        <ArtworkFilterNavigator
          {...props}
          id={artist.internalID}
          slug={artist.slug}
          visible={showFilterArtworksModal}
          name={artist.name ?? ""}
          exitModal={closeFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.ArtistArtworks}
          shouldShowCreateAlertButton
        />

        <CreateSavedSearchModal
          attributes={attributes}
          closeModal={() => setIsCreateAlertModalVisible(false)}
          entity={savedSearchEntity}
          onComplete={handleCompleteSavedSearch}
          visible={isCreateAlertModalVisible}
          sizeMetric={sizeMetric}
        />
      </Tabs.ScrollView>
    )
  }

  const ListFooterComponenet = () => {
    return (
      <>
        {!!showCreateAlertAtEndOfList && !hasNext && (
          <Message
            title="Get notified when new works are added."
            containerStyle={{ my: 2 }}
            IconComponent={() => {
              return <CreateAlertButton contextModule={ContextModule.artistArtworksGridEnd} />
            }}
            iconPosition="right"
          />
        )}
        <AnimatedMasonryListFooter shouldDisplaySpinner={!!hasNext && isLoadingNext} />
      </>
    )
  }

  const shouldShowCreateAlertReminder = artworks.length >= CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD

  return (
    <Flex backgroundColor={color("mono0")} flex={1}>
      <Tabs.Masonry
        data={artworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        innerRef={gridRef}
        ListEmptyComponent={
          <Box mb="80px" pt={2}>
            <FilteredArtworkGridZeroState
              id={artist.id}
              slug={artist.slug}
              trackClear={trackClear}
              hideClearButton={!appliedFilters.length}
            />
          </Box>
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <>
            <Tabs.SubTabBar>
              <Flex flexDirection="row">
                <ProgressiveOnboardingAlertReminder visible={!!shouldShowCreateAlertReminder} />
                <Flex flex={1}>
                  <ArtistArtworksFilterHeader
                    artist={artist}
                    showCreateAlertModal={() => {
                      if (shouldShowCreateAlertReminder) {
                        dismissAllCreateAlertReminder()
                      }

                      setIsCreateAlertModalVisible(true)
                    }}
                  />
                </Flex>
              </Flex>
            </Tabs.SubTabBar>
            <Flex pt={1}>
              <Text variant="xs" weight="medium">{`${artworksCount} Artwork${
                artworksCount > 1 ? "s" : ""
              }:`}</Text>
            </Flex>
          </>
        }
        ListFooterComponent={<ListFooterComponenet />}
      />

      <ArtworkFilterNavigator
        {...props}
        id={artist.internalID}
        slug={artist.slug}
        visible={!!showFilterArtworksModal}
        name={artist.name ?? ""}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.ArtistArtworks}
        shouldShowCreateAlertButton
      />

      <CreateSavedSearchModal
        attributes={attributes}
        closeModal={() => setIsCreateAlertModalVisible(false)}
        entity={savedSearchEntity}
        onComplete={handleCompleteSavedSearch}
        visible={isCreateAlertModalVisible}
      />
    </Flex>
  )
}

const artistAggregation = graphql`
  fragment ArtistArtworks_artistAggregation on Artist {
    aggregations: filterArtworksConnection(
      first: 0
      aggregations: [
        ARTIST_SERIES
        LOCATION_CITY
        MAJOR_PERIOD
        MATERIALS_TERMS
        MEDIUM
        PARTNER
        SIMPLE_PRICE_HISTOGRAM
      ]
    ) {
      aggregations {
        slice
        counts {
          count
          name
          value
        }
      }
    }
  }
`
const artistArtworksFragment = graphql`
  fragment ArtistArtworks_artist on Artist
  @refetchable(queryName: "ArtistArtworks_artistRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    ...ArtistArtworksFilterHeader_artist
    id
    slug
    name
    internalID
    counts {
      artworks
    }
    artworks: filterArtworksConnection(first: $count, after: $cursor, input: $input)
      @connection(key: "ArtistArtworksGrid_artworks") {
      counts {
        total
      }
      edges {
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
    statuses {
      artworks
    }
  }
`

interface ArtistArtworksQueryRendererProps {
  artistID: string
  input: FilterArtworksInput
  searchCriteria: SearchCriteriaAttributes | null
  predefinedFilters?: FilterArray
  scrollToArtworksGrid: boolean
}

export const ArtistArtworksQueryRenderer = withSuspense<ArtistArtworksQueryRendererProps>({
  Component: (props) => {
    const data = useLazyLoadQuery<ArtistArtworksQuery>(
      artistArtworksQuery,
      {
        artistID: props.artistID,
        input: props.input,
      },
      {
        fetchPolicy: "store-or-network",
      }
    )

    if (!data?.artist) {
      return null
    }

    return <ArtworksGrid artist={data.artist} {...props} />
  },
  LoadingFallback: () => <ArtistArtworksPlaceholder />,
  ErrorFallback: (fallbackProps) => {
    return <ArtistArtworksError {...fallbackProps} />
  },
})

const ArtistArtworksPlaceholder = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1, paddingHorizontal: 0, paddingTop: space(2) }}
    >
      <Flex px={2} testID="ArtistArtworksPlaceholder">
        <Flex flexDirection="row" justifyContent="space-between">
          <SkeletonText>Create Alert</SkeletonText>
          <SkeletonText>Sort & Filter</SkeletonText>
        </Flex>

        <Spacer y={2} />

        <Flex borderBottomWidth={1} borderBottomColor="mono100" mx={-2} />

        <Spacer y={2} />

        <SkeletonText variant="xs">XX Artworks</SkeletonText>

        <Spacer y={2} />

        <PlaceholderGrid mx={0} />
      </Flex>
    </Tabs.ScrollView>
  )
}

const ArtistArtworksError: React.FC<LoadFailureViewProps> = (fallbackProps) => {
  return (
    <Tabs.ScrollView contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 20 }}>
      <LoadFailureView
        onRetry={fallbackProps.onRetry}
        useSafeArea={false}
        // This is needed to override the default flex={1}
        flex={undefined}
        error={fallbackProps.error}
        showBackButton={false}
        trackErrorBoundary={false}
      />
    </Tabs.ScrollView>
  )
}

export const artistArtworksQuery = graphql`
  query ArtistArtworksQuery($artistID: String!, $input: FilterArtworksInput) {
    artist(id: $artistID) {
      internalID
      slug
      ...ArtistArtworks_artist @arguments(input: $input)
      ...ArtistArtworks_artistAggregation
    }
  }
`
