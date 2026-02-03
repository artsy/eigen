import {
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FilterArtworksInput } from "__generated__/ArtistArtworks_artistRefetch.graphql"
import { ArtistQuery } from "__generated__/ArtistQuery.graphql"
import {
  artistAboutQuery,
  ArtistAboutQueryRenderer,
} from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistArtworksQueryRenderer } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeader, useArtistHeaderImageDimensions } from "app/Components/Artist/ArtistHeader"
import { ArtistHeaderNavRightQueryRenderer } from "app/Components/Artist/ArtistHeaderNavRight"
import {
  artistInsightsQuery,
  ArtistInsightsQueryRenderer,
} from "app/Components/Artist/ArtistInsights/ArtistInsights"
import {
  FilterArray,
  filterArtworksParams,
  getFilterArrayFromQueryParams,
  getFilterParamsFromRouteParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEFAULT_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { SkeletonPill } from "app/Components/SkeletonPill/SkeletonPill"
import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const INITIAL_TAB = "Artworks"

// Move to a shared file if used elsewhere
interface RouteParams {
  props?: {
    [key: string]: any
  }
}

interface ArtistProps {
  artist: NonNullable<ArtistQuery["response"]["artist"]>
  auctionResultsInitialFilters?: FilterArray
  fetchCriteriaError: Error | null
  initialTab?: string
  predefinedFilters?: FilterArray
  scrollToArtworksGrid: boolean
  searchCriteria: SearchCriteriaAttributes | null
  input: FilterArtworksInput
}

export const Artist: React.FC<ArtistProps> = ({
  artist,
  auctionResultsInitialFilters,
  fetchCriteriaError,
  initialTab = INITIAL_TAB,
  predefinedFilters,
  scrollToArtworksGrid,
  searchCriteria,
  input,
}) => {
  const popoverMessage = usePopoverMessage()

  useEffect(() => {
    if (!!fetchCriteriaError) {
      popoverMessage.show({
        title: "Sorry, an error occured",
        message: "Failed to get saved search criteria",
        placement: "top",
        type: "error",
      })
    }
  }, [fetchCriteriaError])

  // Prefetch the About and Insights tab queries on mount
  useEffect(() => {
    prefetchQuery({
      query: artistAboutQuery,
      variables: { artistID: artist.internalID },
    })
    prefetchQuery({
      query: artistInsightsQuery,
      variables: { artistID: artist.internalID },
    })
  }, [artist.internalID])

  const renderBelowTheHeaderComponent = useCallback(
    () => <ArtistHeader artist={artist} />,
    [artist]
  )

  const artistHeaderRight = useMemo(() => {
    return <ArtistHeaderNavRightQueryRenderer artistID={artist.internalID} />
  }, [artist])

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artist.slug,
        context_screen_owner_id: artist.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <KeyboardAvoidingContainer>
          <Tabs.TabsWithHeader
            disableKeyboardAvoidance
            initialTabName={initialTab}
            title={artist.name ?? ""}
            showLargeHeaderText={false}
            BelowTitleHeaderComponent={renderBelowTheHeaderComponent}
            headerProps={{
              rightElements: artistHeaderRight,
              onBack: goBack,
            }}
          >
            <Tabs.Tab name="Artworks" label="Artworks">
              <Tabs.Lazy>
                <ArtistArtworksQueryRenderer
                  artistID={artist.internalID}
                  input={input}
                  searchCriteria={searchCriteria}
                  predefinedFilters={predefinedFilters}
                  scrollToArtworksGrid={scrollToArtworksGrid}
                />
              </Tabs.Lazy>
            </Tabs.Tab>

            <Tabs.Tab name="Insights" label="Auction Results">
              <Tabs.Lazy>
                <ArtistInsightsQueryRenderer
                  artistID={artist.internalID}
                  initialFilters={auctionResultsInitialFilters}
                />
              </Tabs.Lazy>
            </Tabs.Tab>

            <Tabs.Tab name="Overview" label="About">
              <Tabs.Lazy>
                <ArtistAboutQueryRenderer artistID={artist.internalID} />
              </Tabs.Lazy>
            </Tabs.Tab>
          </Tabs.TabsWithHeader>
        </KeyboardAvoidingContainer>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps {
  alertID?: string
  artistID: string
  categories?: string[]
  initialTab?: string
  predefinedFilters?: FilterArray
  scrollToArtworksGrid?: boolean
  search_criteria_id?: string
  sizes?: string[]
  // This is used to determine if the artist has a verified representative for a more accurate skeleton
  verifiedRepresentativesCount?: number
}

export const ArtistScreenQuery = graphql`
  query ArtistQuery($artistID: String!) @cacheable {
    artist(id: $artistID) {
      ...ArtistHeader_artist
      id
      internalID
      slug
      href
      name
    }
  }
`

export const defaultArtistVariables = {
  input: prepareFilterArtworksParamsForInput({
    ...filterArtworksParams([], "artwork"),
    sort: DEFAULT_ARTWORK_SORT.paramValue,
  }),
}

const ArtistSkeleton: React.FC<{ verifiedRepresentativesCount?: number }> = ({
  verifiedRepresentativesCount = 0,
}) => {
  const { height, width } = useArtistHeaderImageDimensions()

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth disableKeyboardAvoidance>
        <Skeleton>
          <SkeletonBox width={width} height={height} />

          <Spacer y={2} />

          <Flex px={2}>
            <SkeletonText variant="lg-display">Artist Name</SkeletonText>
            <Spacer y={0.5} />
            <SkeletonText variant="lg-display">American, b. 1945</SkeletonText>
          </Flex>

          <Spacer y={2} />

          {verifiedRepresentativesCount > 0 && (
            <Flex pointerEvents="none" px={2}>
              <SkeletonText variant="sm" color="mono60">
                Featured representation
              </SkeletonText>

              <Spacer y={2} />

              <Flex flexDirection="row">
                {Array.from({ length: verifiedRepresentativesCount }).map((_, index) => {
                  return <SkeletonPill key={index} />
                })}
              </Flex>
            </Flex>
          )}

          <Spacer y={4} />
          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">Auction Results</SkeletonText>
            <SkeletonText variant="xs">About</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={4} />
      </Screen.Body>
    </Screen>
  )
}

interface ArtistScreenProps {
  artistID: string
  categories?: string[]
  initialTab?: string
  predefinedFilters?: FilterArray
  scrollToArtworksGrid: boolean
  sizes?: string[]
  searchCriteria: SearchCriteriaAttributes | null
  fetchCriteriaError: Error | null
  filters: FilterArray
  verifiedRepresentativesCount?: number
}

const ArtistScreen = withSuspense<ArtistScreenProps>({
  Component: ({
    artistID,
    categories,
    initialTab,
    predefinedFilters,
    scrollToArtworksGrid,
    sizes,
    searchCriteria,
    fetchCriteriaError,
    filters,
  }) => {
    const data = useLazyLoadQuery<ArtistQuery>(ArtistScreenQuery, { artistID })

    if (!data.artist) {
      return null
    }

    const predefinedFilterParams = filterArtworksParams(filters ?? [], "artwork")

    let initialArtworksInput = {
      ...defaultArtistVariables.input,
      ...predefinedFilterParams,
    }

    if (searchCriteria) {
      const preparedCriteria = getOnlyFilledSearchCriteriaValues(searchCriteria)

      initialArtworksInput = {
        ...initialArtworksInput,
        ...preparedCriteria,
        sort: "-published_at",
      }
    }

    const input = prepareFilterArtworksParamsForInput(initialArtworksInput)

    return (
      <Artist
        artist={data.artist}
        initialTab={initialTab}
        searchCriteria={searchCriteria}
        fetchCriteriaError={fetchCriteriaError}
        predefinedFilters={predefinedFilters}
        auctionResultsInitialFilters={getFilterArrayFromQueryParams({
          categories: categories ?? [],
          sizes: sizes ?? [],
        })}
        scrollToArtworksGrid={scrollToArtworksGrid}
        input={input as FilterArtworksInput}
      />
    )
  },
  LoadingFallback: ArtistSkeleton,
  ErrorFallback: ({ error }) => (
    <LoadFailureView showBackButton error={error} trackErrorBoundary={false} />
  ),
})

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = ({
  alertID,
  artistID,
  categories,
  initialTab,
  predefinedFilters,
  scrollToArtworksGrid = false,
  search_criteria_id,
  sizes,
  verifiedRepresentativesCount,
}) => {
  // extract filter params from the query string. This is needed when
  // the screen is opened via deeplink (/artist/kaws?attribution_class=..., for instance)
  // to make sure the filters are applied correctly
  const route = useRoute()
  const routeParams = (route?.params as RouteParams)?.props || {}
  const filters: FilterArray = [
    ...(predefinedFilters || []),
    ...getFilterParamsFromRouteParams(routeParams),
  ]

  return (
    <SearchCriteriaQueryRenderer
      alertId={alertID ?? search_criteria_id}
      render={{
        renderPlaceholder: () => (
          <ArtistSkeleton verifiedRepresentativesCount={verifiedRepresentativesCount} />
        ),
        renderComponent: ({ savedSearchCriteria, fetchCriteriaError }) => {
          return (
            <ArtistScreen
              artistID={artistID}
              categories={categories}
              initialTab={initialTab}
              predefinedFilters={predefinedFilters}
              scrollToArtworksGrid={scrollToArtworksGrid}
              sizes={sizes}
              searchCriteria={savedSearchCriteria}
              fetchCriteriaError={fetchCriteriaError}
              filters={filters}
              verifiedRepresentativesCount={verifiedRepresentativesCount}
            />
          )
        },
      }}
    />
  )
}
