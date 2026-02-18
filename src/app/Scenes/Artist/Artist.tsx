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
import { ArtistAboveTheFoldQuery } from "__generated__/ArtistAboveTheFoldQuery.graphql"
import { FilterArtworksInput } from "__generated__/ArtistArtworks_artistRefetch.graphql"
import { ArtistBelowTheFoldQuery } from "__generated__/ArtistBelowTheFoldQuery.graphql"
import { ArtistAboutContainer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import { ArtistArtworksQueryRenderer } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistHeader, useArtistHeaderImageDimensions } from "app/Components/Artist/ArtistHeader"
import { ArtistHeaderNavRightQueryRenderer } from "app/Components/Artist/ArtistHeaderNavRight"
import { ArtistInsightsFragmentContainer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
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
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useCallback, useEffect, useMemo } from "react"
import { ActivityIndicator, View } from "react-native"
import { Environment, graphql } from "react-relay"

const INITIAL_TAB = "Artworks"

// Move to a shared file if used elsewhere
interface RouteParams {
  props?: {
    [key: string]: any
  }
}

interface ArtistProps {
  artistAboveTheFold: NonNullable<ArtistAboveTheFoldQuery["response"]["artist"]>
  artistBelowTheFold?: ArtistBelowTheFoldQuery["response"]["artist"]
  auctionResultsInitialFilters?: FilterArray
  environment?: Environment
  fetchCriteriaError: Error | null
  initialTab?: string
  predefinedFilters?: FilterArray
  scrollToArtworksGrid: boolean
  searchCriteria: SearchCriteriaAttributes | null
  input: FilterArtworksInput
}

export const Artist: React.FC<ArtistProps> = ({
  artistAboveTheFold,
  artistBelowTheFold,
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

  const renderBelowTheHeaderComponent = useCallback(
    () => <ArtistHeader artist={artistAboveTheFold} />,
    [artistAboveTheFold]
  )

  const artistHeaderRight = useMemo(() => {
    return <ArtistHeaderNavRightQueryRenderer artistID={artistAboveTheFold.internalID} />
  }, [artistAboveTheFold])

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artistAboveTheFold.slug,
        context_screen_owner_id: artistAboveTheFold.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <KeyboardAvoidingContainer>
          <Tabs.TabsWithHeader
            disableKeyboardAvoidance
            initialTabName={initialTab}
            title={artistAboveTheFold.name ?? ""}
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
                  artistID={artistAboveTheFold.internalID}
                  input={input}
                  searchCriteria={searchCriteria}
                  predefinedFilters={predefinedFilters}
                  scrollToArtworksGrid={scrollToArtworksGrid}
                />
              </Tabs.Lazy>
            </Tabs.Tab>

            <Tabs.Tab name="Insights" label="Auction Results">
              <Tabs.Lazy>
                {artistBelowTheFold ? (
                  <ArtistInsightsFragmentContainer
                    artist={artistBelowTheFold}
                    initialFilters={auctionResultsInitialFilters}
                  />
                ) : (
                  <LoadingPage />
                )}
              </Tabs.Lazy>
            </Tabs.Tab>

            <Tabs.Tab name="Overview" label="About">
              <Tabs.Lazy>
                {artistBelowTheFold ? (
                  <ArtistAboutContainer artist={artistBelowTheFold} />
                ) : (
                  <LoadingPage />
                )}
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
  environment?: Environment
  initialTab?: string
  predefinedFilters?: FilterArray
  scrollToArtworksGrid?: boolean
  search_criteria_id?: string
  sizes?: string[]
  // This is used to determine if the artist has a verified representative for a more accurate skeleton
  verifiedRepresentativesCount?: number
}

export const ArtistScreenQuery = graphql`
  query ArtistAboveTheFoldQuery($artistID: String!) @cacheable {
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

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = ({
  alertID,
  artistID,
  categories,
  environment,
  initialTab,
  predefinedFilters,
  scrollToArtworksGrid = false,
  search_criteria_id,
  sizes,
  verifiedRepresentativesCount,
}) => {
  // exctact filter params from the query string. This is needed when
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
      environment={environment}
      render={{
        renderPlaceholder: () => (
          <ArtistSkeleton verifiedRepresentativesCount={verifiedRepresentativesCount} />
        ),
        renderComponent: (searchCriteriaProps) => {
          const { savedSearchCriteria, fetchCriteriaError } = searchCriteriaProps
          const predefinedFilterParams = filterArtworksParams(filters ?? [], "artwork")

          let initialArtworksInput = {
            ...defaultArtistVariables.input,
            ...predefinedFilterParams,
          }

          if (savedSearchCriteria) {
            const preparedCriteria = getOnlyFilledSearchCriteriaValues(savedSearchCriteria)

            initialArtworksInput = {
              ...initialArtworksInput,
              ...preparedCriteria,
              sort: "-published_at",
            }
          }
          const input = prepareFilterArtworksParamsForInput(initialArtworksInput)

          return (
            <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
              environment={environment || getRelayEnvironment()}
              above={{
                query: ArtistScreenQuery,
                variables: {
                  artistID,
                },
              }}
              below={{
                query: graphql`
                  query ArtistBelowTheFoldQuery($artistID: String!) @cacheable {
                    artist(id: $artistID) {
                      ...ArtistAbout_artist
                      ...ArtistInsights_artist
                    }
                  }
                `,
                variables: { artistID },
              }}
              fallback={({ error }) => (
                <LoadFailureView showBackButton error={error} trackErrorBoundary={false} />
              )}
              render={{
                renderPlaceholder: () => (
                  <ArtistSkeleton verifiedRepresentativesCount={verifiedRepresentativesCount} />
                ),
                renderComponent: ({ above, below }) => {
                  if (!above.artist) {
                    throw new Error("no artist data")
                  }
                  return (
                    <Artist
                      artistAboveTheFold={above.artist}
                      artistBelowTheFold={below?.artist}
                      initialTab={initialTab}
                      searchCriteria={savedSearchCriteria}
                      fetchCriteriaError={fetchCriteriaError}
                      predefinedFilters={filters}
                      auctionResultsInitialFilters={getFilterArrayFromQueryParams({
                        categories: categories ?? [],
                        sizes: sizes ?? [],
                      })}
                      scrollToArtworksGrid={scrollToArtworksGrid}
                      input={input as FilterArtworksInput}
                    />
                  )
                },
              }}
            />
          )
        },
      }}
    />
  )
}

/**
 * Be lazy and just have a simple loading spinner for the below-the-fold tabs
 * (as opposed to nice fancy placeholder screens) since people are really
 * unlikely to tap into them quick enough to see the loading state
 * @param param0
 */
const LoadingPage: React.FC<{}> = ({}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  )
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
