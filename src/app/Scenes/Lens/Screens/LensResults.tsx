import {
  ActionType,
  ContextModule,
  OwnerType,
  SearchedByImageWithNoResults,
  SearchedByImageWithResults,
} from "@artsy/cohesion"
import { Button, Flex, Screen, SimpleMessage } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FilterArtworksInput, LensResultsQuery } from "__generated__/LensResultsQuery.graphql"
import { LensResults_aggregations$key } from "__generated__/LensResults_aggregations.graphql"
import {
  LensResults_artworks$data,
  LensResults_artworks$key,
} from "__generated__/LensResults_artworks.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { PAGE_SIZE } from "app/Components/constants"
import { LensResultsHeader } from "app/Scenes/Lens/Components/LensResultsHeader"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { useEffect, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

const MATCHES_TITLE = "Great taste! Here are some matches to your photo"
const NO_MATCHES_TITLE = "Unfortunately, we couldn't find great matches for that photo"
const SEARCHING_TITLE = "Searching for matches..."

/** Image search only supports the default sort, which `filterArtworksParams` adds. */
const INITIAL_INPUT = prepareFilterArtworksParamsForInput(
  filterArtworksParams([], "artwork")
) as FilterArtworksInput

type Props = StackScreenProps<LensNavigationStack, "LensResults">

type Navigation = Props["navigation"]

/** `navigate`, not `push`: LensCamera is this stack's root and still mounted below. */
const restartSearch = (navigation: Navigation) => {
  navigation.navigate("LensCamera")
}

const LensResults: React.FC<Props> = ({ route, navigation }) => {
  const { s3Bucket, s3Key, photoUri, fromLibrary } = route.params
  const tracking = useTracking()
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  const queryData = useLazyLoadQuery<LensResultsQuery>(lensResultsQuery, {
    s3Bucket,
    s3Key,
    input: INITIAL_INPUT,
    count: PAGE_SIZE,
  })

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    LensResultsQuery,
    LensResults_artworks$key
  >(artworksFragment, queryData)

  const aggregationsData = useFragment<LensResults_aggregations$key>(
    aggregationsFragment,
    queryData
  )

  // Aggregations are read once, unfiltered, so options don't disappear as filters narrow results.
  useArtworkFilters({
    refetch,
    aggregations: aggregationsData.artworksConnectionAggregations?.aggregations,
    componentPath: "Lens/LensResults",
    pageSize: PAGE_SIZE,
  })

  const appliedFiltersCount = useSelectedFiltersCount()
  const clearFilters = ArtworksFiltersStore.useStoreActions(
    (actions) => actions.clearFiltersZeroStateAction
  )

  const artworks = extractNodes(data.artworksConnection)
  // Suspense holds the placeholder until the query resolves, so empty and unfiltered here means
  // no matches.
  const hasNoMatches = artworks.length === 0 && appliedFiltersCount === 0

  useEffect(() => {
    const photoSource = fromLibrary ? "photo_library" : "camera"

    tracking.trackEvent(
      hasNoMatches
        ? tracks.searchedByImageWithNoResults(photoSource)
        : tracks.searchedByImageWithResults(photoSource)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Screen>
      <LensResultsHeader
        onBack={goBack}
        photoUri={photoUri}
        title={hasNoMatches ? NO_MATCHES_TITLE : MATCHES_TITLE}
        // Nothing to filter when the photo itself has no matches
        onFilterPress={hasNoMatches ? undefined : () => setIsFilterModalVisible(true)}
        selectedFiltersCount={appliedFiltersCount}
      />

      <Screen.Body fullwidth pt={1}>
        <ArtworksGrid
          artworks={artworks}
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          loadMore={(pageSize) => loadNext(pageSize)}
          appliedFiltersCount={appliedFiltersCount}
          onClearFiltersPress={() => clearFilters()}
        />
      </Screen.Body>

      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        mode={FilterModalMode.SearchByImage}
        title="Filter"
        exitModal={() => setIsFilterModalVisible(false)}
        closeModal={() => setIsFilterModalVisible(false)}
      />

      {!!hasNoMatches && (
        <Screen.BottomView>
          <SearchByPhotoButton
            testID="lensResultsSearchByPhotoButton"
            label="Try another photo"
            onPress={() => restartSearch(navigation)}
          />
        </Screen.BottomView>
      )}
    </Screen>
  )
}

const ArtworksGrid: React.FC<{
  artworks: ExtractNodeType<LensResults_artworks$data["artworksConnection"]>[]
  hasNext: boolean
  isLoadingNext: boolean
  loadMore: (pageSize: number) => void
  appliedFiltersCount: number
  onClearFiltersPress: () => void
}> = ({ artworks, hasNext, isLoadingNext, loadMore, appliedFiltersCount, onClearFiltersPress }) => {
  return (
    <MasonryInfiniteScrollArtworkGrid
      artworks={artworks}
      contextModule={ContextModule.artworkGrid}
      contextScreenOwnerType={OwnerType.searchByImage}
      contextScreen={OwnerType.searchByImage}
      ListEmptyComponent={
        appliedFiltersCount > 0 ? (
          <Flex>
            <SimpleMessage m={2}>No results found for these filters.</SimpleMessage>
            <Flex px={2}>
              <Button
                testID="lensResultsClearFiltersButton"
                variant="outline"
                block
                onPress={onClearFiltersPress}
              >
                Clear filters
              </Button>
            </Flex>
          </Flex>
        ) : (
          <SimpleMessage m={2}>No matches found. Please try another photo.</SimpleMessage>
        )
      }
      hasMore={hasNext}
      isLoading={isLoadingNext}
      loadMore={loadMore}
    />
  )
}

type PhotoSource = SearchedByImageWithResults["photo_source"]

const tracks = {
  searchedByImageWithResults: (photoSource: PhotoSource): SearchedByImageWithResults => ({
    action: ActionType.searchedByImageWithResults,
    context_owner_type: OwnerType.searchByImage,
    photo_source: photoSource,
  }),
  searchedByImageWithNoResults: (photoSource: PhotoSource): SearchedByImageWithNoResults => ({
    action: ActionType.searchedByImageWithNoResults,
    context_owner_type: OwnerType.searchByImage,
    photo_source: photoSource,
  }),
}

const artworksFragment = graphql`
  fragment LensResults_artworks on Query
  @refetchable(queryName: "LensResultsPaginationQuery")
  @argumentDefinitions(
    s3Bucket: { type: "String!" }
    s3Key: { type: "String!" }
    input: { type: "FilterArtworksInput" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    artworksConnection(
      image: { s3Bucket: $s3Bucket, s3Key: $s3Key }
      input: $input
      first: $count
      after: $after
    ) @connection(key: "LensResults_artworksConnection", filters: ["input", "image"]) {
      edges {
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

const aggregationsFragment = graphql`
  fragment LensResults_aggregations on Query
  @argumentDefinitions(s3Bucket: { type: "String!" }, s3Key: { type: "String!" }) {
    artworksConnectionAggregations: artworksConnection(
      first: 0
      image: { s3Bucket: $s3Bucket, s3Key: $s3Key }
      aggregations: [
        ARTIST
        ARTIST_NATIONALITY
        LOCATION_CITY
        MAJOR_PERIOD
        MATERIALS_TERMS
        MEDIUM
        PARTNER
      ]
    ) {
      aggregations {
        slice
        counts {
          name
          value
        }
      }
    }
  }
`

const lensResultsQuery = graphql`
  query LensResultsQuery(
    $s3Bucket: String!
    $s3Key: String!
    $input: FilterArtworksInput
    $count: Int
    $after: String
  ) {
    ...LensResults_artworks
      @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key, input: $input, count: $count, after: $after)
    ...LensResults_aggregations @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key)
  }
`

export const LensResultsScreen: React.FC<Props> = (props) => {
  const { photoUri } = props.route.params

  // Keep cleanup outside Suspense so it also runs when leaving during loading.
  useEffect(() => {
    return () => {
      discardTempPhotos([photoUri])
    }
  }, [photoUri])

  /**
   * Android hardware back should match the header and leave the Lens route instead of popping the
   * inner stack back to the camera. Registered above the Suspense boundary so it covers the loading
   * state too, and returns `true` to keep the stack's own handler from running after it.
   */
  useBackHandler(() => {
    goBack()
    return true
  })

  /**
   * The store sits above the boundaries so applied filters survive the refetch suspending the
   * screen, and a retry after an error runs the filtered search again.
   */
  return (
    <ArtworkFiltersStoreProvider>
      <LensResultsWithSuspense {...props} />
    </ArtworkFiltersStoreProvider>
  )
}

const LensResultsWithSuspense = withSuspense<Props>({
  Component: LensResults,
  LoadingFallback: ({ route }: Props) => <Placeholder photoUri={route.params.photoUri} />,
  // Keeps the photo and a way back on screen, instead of the route-level error screen
  ErrorFallback: ({ error, resetErrorBoundary }, { route }) => (
    <Screen>
      <LensResultsHeader onBack={goBack} photoUri={route.params.photoUri} />
      <Screen.Body fullwidth>
        <LoadFailureView
          error={error}
          onRetry={resetErrorBoundary}
          useSafeArea={false}
          trackErrorBoundary={false}
        />
      </Screen.Body>
    </Screen>
  ),
})

const Placeholder: React.FC<{ photoUri: string }> = ({ photoUri }) => {
  return (
    <Screen>
      <LensResultsHeader onBack={goBack} photoUri={photoUri} title={SEARCHING_TITLE} />
      <Screen.Body fullwidth pt={1}>
        <PlaceholderGrid />
      </Screen.Body>
    </Screen>
  )
}
