import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { CollectArtworks_viewer$key } from "__generated__/CollectArtworks_viewer.graphql"
import { CollectArtworks_viewerAggregations$key } from "__generated__/CollectArtworks_viewerAggregations.graphql"
import {
  CollectQuery,
  CollectQuery$data,
  FilterArtworksInput,
} from "__generated__/CollectQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  FilterArray,
  filterArtworksParams,
  FilterParams,
  getFilterParamsFromRouteParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE, SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface CollectContentProps {
  viewer: CollectQuery$data["viewer"]
}

interface CollectHeaderProps {
  appliedFiltersCount: number
  setIsArtworksFilterModalVisible: (visible: boolean) => void
}

const CollectHeader: React.FC<CollectHeaderProps> = ({
  appliedFiltersCount,
  setIsArtworksFilterModalVisible,
}) => {
  const { title, subtitle } = useCollectScreenParams()

  return (
    <Flex mx={-2} gap={1}>
      <Flex px={2} gap={0.5}>
        <Text variant="lg-display">{title}</Text>

        {!!subtitle && <Text variant="sm-display">{subtitle}</Text>}
      </Flex>

      <ArtworksFilterHeader
        selectedFiltersCount={appliedFiltersCount}
        onFilterPress={() => setIsArtworksFilterModalVisible(true)}
        childrenPosition="left"
      >
        <Flex />
      </ArtworksFilterHeader>
    </Flex>
  )
}

export const CollectContent: React.FC<CollectContentProps> = ({ viewer }) => {
  const [isArtworksFilterModalVisible, setIsArtworksFilterModalVisible] = useState(false)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
    viewerFragment,
    viewer as CollectArtworks_viewer$key
  )

  const viewerAggregationsData = useFragment(
    viewerAggregationsFragment,
    viewer as CollectArtworks_viewerAggregations$key
  )

  useArtworkFilters({
    refetch,
    aggregations: viewerAggregationsData?.artworksConnectionAggregations?.aggregations,
    componentPath: "Collect/CollectArtworks",
    pageSize: PAGE_SIZE,
  })

  const artworks = extractNodes(data.artworksConnection)

  const appliedFiltersCount = useSelectedFiltersCount()

  const RefreshControl = useRefreshControl(refetch)

  const { scrollHandler } = Screen.useListenForScreenScroll()

  return (
    <>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        isLoading={isLoadingNext}
        loadMore={() => loadNext(PAGE_SIZE)}
        hasMore={hasNext}
        numColumns={NUM_COLUMNS_MASONRY}
        disableAutoLayout
        pageSize={PAGE_SIZE}
        contextModule={ContextModule.artworkGrid}
        // TODO: Add tracking
        contextScreenOwnerType={OwnerType.collect}
        contextScreen={OwnerType.collect}
        ListEmptyComponent={
          <Flex>
            <CollectHeader
              appliedFiltersCount={appliedFiltersCount}
              setIsArtworksFilterModalVisible={setIsArtworksFilterModalVisible}
            />

            <SimpleMessage my={2}>No artworks found</SimpleMessage>
          </Flex>
        }
        ListHeaderComponent={
          <CollectHeader
            appliedFiltersCount={appliedFiltersCount}
            setIsArtworksFilterModalVisible={setIsArtworksFilterModalVisible}
          />
        }
        onScroll={scrollHandler}
        refreshControl={RefreshControl}
        style={{
          // Extra padding at the bottom of the screen so it's clear that there's no more content
          paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET,
        }}
      />

      <ArtworkFilterNavigator
        visible={isArtworksFilterModalVisible}
        mode={FilterModalMode.Collect}
        exitModal={() => setIsArtworksFilterModalVisible(false)}
        closeModal={() => setIsArtworksFilterModalVisible(false)}
      />
    </>
  )
}

export const viewerFragment = graphql`
  fragment CollectArtworks_viewer on Viewer
  @refetchable(queryName: "CollectArtworks_RefetchQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    artworksConnection(first: $count, after: $cursor, input: $input)
      @connection(key: "CollectArtworks_artworksConnection", filters: ["input"]) {
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
  }
`

const viewerAggregationsFragment = graphql`
  fragment CollectArtworks_viewerAggregations on Viewer {
    artworksConnectionAggregations: artworksConnection(
      first: 0
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

export const collectQuery = graphql`
  query CollectQuery($input: FilterArtworksInput!) {
    viewer @required(action: THROW) {
      ...CollectArtworks_viewer @arguments(input: $input)
      ...CollectArtworks_viewerAggregations
    }
  }
`

type CollectQueryRendererProps = StackScreenProps<any, any>

export const prepareCollectVariables = (params: {
  [key: string]: string | number | boolean | string[]
}) => {
  const filters: FilterArray = getFilterParamsFromRouteParams(params || {})
  const filterParams = filterArtworksParams(filters ?? [], "collect")
  const input = prepareFilterArtworksParamsForInput(filterParams as FilterParams)

  return { input: input as FilterArtworksInput, filters }
}

const CollectQueryRenderer: React.FC<CollectQueryRendererProps> = withSuspense({
  Component: ({ route }) => {
    const { input, filters } = prepareCollectVariables(route.params || {})

    const data = useLazyLoadQuery<CollectQuery>(collectQuery, {
      input: input as FilterArtworksInput,
    })

    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          appliedFilters: filters,
          previouslyAppliedFilters: filters,
          applyFilters: false,
        }}
      >
        <CollectContent viewer={data.viewer} />
      </ArtworkFiltersStoreProvider>
    )
  },
  LoadingFallback: () => {
    const { title, subtitle } = useCollectScreenParams()

    return (
      <>
        <Flex px={2}>
          <Text variant="lg-display">{title}</Text>
          {!!subtitle && (
            <>
              <Spacer y={0.5} />
              <Text variant="sm-display">{subtitle}</Text>
            </>
          )}
        </Flex>
        <ArtworksFilterHeader
          selectedFiltersCount={0}
          onFilterPress={() => {}}
          childrenPosition="left"
        >
          <Flex />
        </ArtworksFilterHeader>
        <Spacer y={2} />
        <PlaceholderGrid />
      </>
    )
  },
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

export const Collect: React.FC<CollectQueryRendererProps> = (props) => {
  const { title } = useCollectScreenParams()
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.collect })}
    >
      <Screen>
        <Screen.AnimatedHeader onBack={goBack} title={title} />

        <Screen.Body fullwidth>
          <CollectQueryRenderer {...props} />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

type CollectParams = {
  params?: {
    title?: string
    subtitle?: string
    disableSubtitle?: string
  }
}

const useCollectScreenParams = () => {
  const { params } = useRoute<RouteProp<CollectParams>>()

  const title = params?.title ?? "Collect"
  const subtitle = params?.subtitle ?? "Collect art and design online"

  return {
    title,
    subtitle: params?.disableSubtitle ? undefined : subtitle,
  }
}
