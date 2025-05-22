import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MyCollectionArtworksQuery } from "__generated__/MyCollectionArtworksQuery.graphql"
import { MyCollectionArtworks_me$key } from "__generated__/MyCollectionArtworks_me.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { MyCollectionZeroState } from "app/Scenes/MyCollection/Components/MyCollectionZeroState"
import { MyCollectionArtworkGridItemFragmentContainer } from "app/Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkGridItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { cleanLocalImages } from "app/utils/LocalImageStore"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import {
  MY_COLLECTION_REFRESH_KEY,
  useRefreshControl,
  useRefreshFetchKey,
} from "app/utils/refreshHelpers"
import { useCallback, useEffect } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import {
  localSortAndFilterArtworks,
  useLocalArtworkFilter,
} from "./utils/localArtworkSortAndFilter"

interface MyCollectionArtworksProps {
  me: MyCollectionArtworks_me$key
}

export const MyCollectionArtworks: React.FC<MyCollectionArtworksProps> = ({ me }) => {
  const space = useSpace()
  const { width } = useScreenDimensions()

  const { setIsFilterModalVisible, setFiltersCount } = MyCollectionTabsStore.useStoreActions(
    (actions) => actions
  )
  const { isFilterModalVisible } = MyCollectionTabsStore.useStoreState((state) => state)

  const { data, loadNext, isLoadingNext, hasNext, refetch } = usePaginationFragment(meFragment, me)

  const artworks = extractNodes(data?.myCollectionConnection)

  useLocalArtworkFilter(artworks)

  const filtersCount = useSelectedFiltersCount()

  const query = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterOptions = ArtworksFiltersStore.useStoreState((state) => state.filterOptions)

  const filteredArtworks = localSortAndFilterArtworks(
    artworks as any,
    appliedFiltersState,
    filterOptions,
    query
  )

  useEffect(() => {
    setFiltersCount(filtersCount)
  }, [filtersCount])

  useEffect(() => {
    cleanLocalImages()
  }, [])

  const renderItem = useCallback(({ item, columnIndex }) => {
    const imgAspectRatio = item.image?.aspectRatio ?? 1
    const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
    const imgHeight = imgWidth / imgAspectRatio

    return (
      <Flex
        pl={columnIndex === 0 ? 0 : 1}
        pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
        mt={2}
      >
        <MyCollectionArtworkGridItemFragmentContainer
          contextScreenOwnerType={OwnerType.gene}
          contextScreenOwnerId={item.internalID}
          contextScreenOwnerSlug={item.slug}
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  const RefreshControl = useRefreshControl(refetch)

  if (!data.myCollectionConnection) {
    console.warn("Something went wrong, me.myCollectionConnection failed to load")
    return null
  }

  // User has no artworks in their collection
  // We are intentionally checking for artworks instead of filteredArtworks
  // because we have a different zero state for filtered artworks
  if (artworks.length === 0) {
    return <MyCollectionZeroState RefreshControl={RefreshControl} />
  }

  const shouldDisplaySpinner = isLoadingNext && hasNext

  return (
    <Flex flex={1}>
      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        mode={FilterModalMode.Custom}
        closeModal={() => setIsFilterModalVisible(false)}
        exitModal={() => setIsFilterModalVisible(false)}
      />
      <Tabs.Masonry
        data={filteredArtworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Box mb="80px" pt={2}>
            <FilteredArtworkGridZeroState hideClearButton />
          </Box>
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNext && !isLoadingNext) {
            loadNext(PAGE_SIZE)
          }
        }}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        ListFooterComponent={
          <AnimatedMasonryListFooter shouldDisplaySpinner={shouldDisplaySpinner} />
        }
        refreshControl={RefreshControl}
      />
    </Flex>
  )
}

/**
 * * IMPORTANT *
 *
 * The following shared artwork fields are needed for sorting and filtering artworks locally
 *
 * When adding new filters this fragment needs to be updated.
 */
export const MyCollectionFilterPropsFragment = graphql`
  fragment MyCollectionArtworks_filterProps on Artwork {
    title
    slug
    id
    artistNames
    medium
    mediumType {
      name
    }
    attributionClass {
      name
    }
    artist {
      internalID
      name
    }
    pricePaid {
      minor
    }
    sizeBucket
    width
    height
    date
    marketPriceInsights {
      demandRank
    }
  }
`

const meFragment = graphql`
  fragment MyCollectionArtworks_me on Me
  @refetchable(queryName: "MyCollectionArtworksRefetchQuery")
  @argumentDefinitions(count: { type: "Int", defaultValue: 30 }, cursor: { type: "String" }) {
    id
    myCollectionInfo {
      includesPurchasedArtworks
      artworksCount
    }
    userInterestsConnection(first: 20, category: COLLECTED_BEFORE, interestType: ARTIST) {
      totalCount
    }
    myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
      @connection(key: "MyCollection_myCollectionConnection", filters: []) {
      edges {
        node {
          title
          slug
          id
          image(includeAll: true) {
            aspectRatio
            blurhash
          }
          artistNames
          medium
          artist {
            targetSupply {
              isTargetSupply
            }
            internalID
            name
          }
          pricePaid {
            minor
          }
          sizeBucket
          width
          height
          date
          # TODO: Porting this legacy fragment here
          # I am unfamiliar with this logic and it's not clear if it's needed
          ...MyCollectionArtworks_filterProps @relay(mask: false)

          ...MyCollectionArtworkGridItem_artwork @arguments(includeAllImages: true)
        }
      }
    }
  }
`

const myCollectionArtworksQuery = graphql`
  query MyCollectionArtworksQuery {
    me {
      ...MyCollectionArtworks_me
    }
  }
`

const MyCollectionArtworksPlaceholder: React.FC<{}> = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView
      contentContainerStyle={{
        // Override the default margin coming from Palette
        marginHorizontal: 0,
        paddingTop: space(1),
      }}
    >
      <PlaceholderGrid />
    </Tabs.ScrollView>
  )
}

export const MyCollectionArtworksQueryRenderer = withSuspense({
  Component: () => {
    const fetchKey = useRefreshFetchKey(MY_COLLECTION_REFRESH_KEY)

    const data = useLazyLoadQuery<MyCollectionArtworksQuery>(
      myCollectionArtworksQuery,
      {},
      {
        fetchKey,
        fetchPolicy: "store-and-network",
      }
    )

    if (!data.me) {
      return null
    }

    return (
      <MyCollectionArtworksKeywordStore.Provider>
        <ArtworkFiltersStoreProvider>
          <MyCollectionArtworks me={data.me} />
        </ArtworkFiltersStoreProvider>
      </MyCollectionArtworksKeywordStore.Provider>
    )
  },
  LoadingFallback: MyCollectionArtworksPlaceholder,
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={false}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
