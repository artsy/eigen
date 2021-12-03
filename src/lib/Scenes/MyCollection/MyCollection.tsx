import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import AsyncStorage from "@react-native-community/async-storage"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { EventEmitter } from "events"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { FilterData, FilterDisplayName, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/ArtworksFilterHeader"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/Components/constants"
import { ZeroState } from "lib/Components/States/ZeroState"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { unsafe_getFeatureFlag, useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import _, { filter, orderBy, uniqBy } from "lodash"
import { DateTime } from "luxon"
import { Banner, Button, Flex, Separator, Spacer, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { Platform, RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkFormModal } from "./Screens/ArtworkFormModal/MyCollectionArtworkFormModal"

const RefreshEvents = new EventEmitter()
const REFRESH_KEY = "refresh"

export function refreshMyCollection() {
  RefreshEvents.emit(REFRESH_KEY)
}

const featureFlagKey = Platform.select({
  android: "AREnableMyCollectionAndroid",
  ios: "AREnableMyCollectionIOS",
}) as "AREnableMyCollectionIOS" | "AREnableMyCollectionAndroid"

export const useEnableMyCollection = () => {
  return useFeatureFlag(featureFlagKey)
}

export function unsafe_getEnableMyCollection() {
  return unsafe_getFeatureFlag(featureFlagKey)
}

export const HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER = "HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER"

const hasBeenShownBanner = async () => {
  const hasSeen = await AsyncStorage.getItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER)
  return hasSeen === "true"
}

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me
}> = ({ relay, me }) => {
  const { trackEvent } = useTracking()
  const [showModal, setShowModal] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const filtersCount = useSelectedFiltersCount()
  const enabledSortAndFilter = useFeatureFlag("ARMyCollectionLocalSortAndFilter")

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const artworks = extractNodes(me?.myCollectionConnection)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const setFilterType = ArtworksFiltersStore.useStoreActions((s) => s.setFilterTypeAction)
  const setSortOptions = ArtworksFiltersStore.useStoreActions((s) => s.setSortOptions)
  const setFilterOptions = ArtworksFiltersStore.useStoreActions((s) => s.setFilterOptions)
  const filterOptions = ArtworksFiltersStore.useStoreState((s) => s.filterOptions)

  useEffect(() => {
    setFilterType("local")
    setSortOptions([
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical Artist Name (A-Z)",
        paramValue: "local-alpha-a-z",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "asc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical Artist Name (Z-A)",
        paramValue: "local-alpha-z-a",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "desc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Artwork Year (Old-New)",
        paramValue: "local-year-old-new",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              const date = DateTime.fromISO(a.date)
              return date.isValid ? date.toMillis() : Number.POSITIVE_INFINITY
            },
            "asc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Artwork Year (New-Old)",
        paramValue: "local-year-new-old",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              const date = DateTime.fromISO(a.date)
              return date.isValid ? date.toMillis() : 0
            },
            "desc"
          ),
      },
    ])
    setFilterOptions([
      {
        displayText: FilterDisplayName.sort,
        filterType: "sort",
        ScreenComponent: "SortOptionsScreen",
      },
      {
        displayText: FilterDisplayName.additionalGeneIDs,
        filterType: "additionalGeneIDs",
        ScreenComponent: "AdditionalGeneIDsOptionsScreen",
        values: uniqBy(
          artworks.map(
            (a): FilterData => ({
              displayText: a.medium ?? "N/A",
              paramName: FilterParamName.additionalGeneIDs,
              paramValue: a.medium ?? undefined,
            })
          ),
          (m) => m.paramName
        ),
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks, mediums: string[]) => filter(artworks, (a) => mediums.includes(a.medium)),
      },
    ])
  }, [])

  useEffect(() => {
    RefreshEvents.addListener(REFRESH_KEY, refetch)
    return () => {
      RefreshEvents.removeListener(REFRESH_KEY, refetch)
    }
  }, [])

  const refetch = () => {
    setIsRefreshing(true)
    relay.refetchConnection(PAGE_SIZE, (err) => {
      setIsRefreshing(false)
      if (err && __DEV__) {
        console.error(err)
      }
    })
  }

  // hack for tests. we should fix that.
  const setJSX = __TEST__ ? jest.fn() : useContext(StickyTabPageFlatListContext).setJSX

  const space = useSpace()

  const allowOrderImports = useFeatureFlag("AREnableMyCollectionOrderImport")

  useEffect(() => {
    if (artworks.length) {
      hasBeenShownBanner().then((hasSeenBanner) => {
        const showNewWorksBanner = me.myCollectionInfo?.includesPurchasedArtworks && allowOrderImports && !hasSeenBanner
        setJSX(
          <Flex>
            {enabledSortAndFilter ? (
              <ArtworksFilterHeader
                selectedFiltersCount={filtersCount}
                onFilterPress={() => setFilterModalVisible(true)}
              >
                <Button
                  data-test-id="add-artwork-button-non-zero-state"
                  size="small"
                  variant="fillDark"
                  onPress={() => {
                    setShowModal(true)
                    trackEvent(tracks.addCollectedArtwork())
                  }}
                  haptic
                >
                  Add Works
                </Button>
              </ArtworksFilterHeader>
            ) : (
              <Flex flexDirection="row" alignSelf="flex-end" px={2} py={1}>
                <Button
                  testID="add-artwork-button-non-zero-state"
                  size="small"
                  variant="fillDark"
                  onPress={() => {
                    setShowModal(true)
                    trackEvent(tracks.addCollectedArtwork())
                  }}
                  haptic
                >
                  Add Works
                </Button>
              </Flex>
            )}
            {!!showNewWorksBanner && (
              <Banner
                title="You have some artworks."
                text="To help add your current artworks to your collection, we automatically added your purchases from your order history."
                showCloseButton
                containerStyle={{ mb: 2 }}
                onClose={() => AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")}
              />
            )}
          </Flex>
        )
      })
    } else {
      // remove already set JSX
      setJSX(null)
    }
  }, [artworks.length, filtersCount, enabledSortAndFilter])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
      <MyCollectionArtworkFormModal
        mode="add"
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false)
          refreshMyCollection()
        }}
      />

      <ArtworkFilterNavigator
        visible={filterModalVisible}
        mode={FilterModalMode.Custom}
        closeModal={() => setFilterModalVisible(false)}
        exitModal={() => setFilterModalVisible(false)}
      />

      <StickyTabPageScrollView
        contentContainerStyle={{ paddingBottom: space(2) }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refetch} />}
      >
        {artworks.length === 0 ? (
          <ZeroState
            title="Your art collection in your pocket."
            subtitle="Keep track of your collection all in one place and get market insights"
            callToAction={
              <Button
                testID="add-artwork-button-zero-state"
                onPress={() => {
                  setShowModal(true)
                  trackEvent(tracks.addCollectedArtwork())
                }}
                block
              >
                Add artwork
              </Button>
            }
          />
        ) : (
          <InfiniteScrollMyCollectionArtworksGridContainer
            myCollectionConnection={me.myCollectionConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            // tslint:disable-next-line: no-shadowed-variable
            localSortAndFilterArtworks={(artworks: MyCollectionArtworkListItem_artwork[]) => {
              let processedArtworks = artworks

              const filtering = uniqBy(
                appliedFiltersState.filter((x) => x.paramName !== FilterParamName.sort),
                (f) => f.paramName
              )
              // tslint:disable-next-line: no-shadowed-variable
              filtering.forEach((filter) => {
                const filterStep = (filterOptions ?? []).find((f) => f.filterType === filter.paramName)!
                  .localSortAndFilter!
                processedArtworks = filterStep(processedArtworks, filter.paramValue)
              })

              const sorting = appliedFiltersState.filter((x) => x.paramName === FilterParamName.sort)
              if (sorting.length > 0) {
                const sortStep = sorting[0].localSortAndFilter!
                processedArtworks = sortStep(processedArtworks)
              }

              return processedArtworks
            }}
          />
        )}
      </StickyTabPageScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const MyCollectionContainer = createPaginationContainer(
  MyCollection,
  {
    me: graphql`
      fragment MyCollection_me on Me
      @argumentDefinitions(
        excludePurchasedArtworks: { type: "Boolean", defaultValue: true }
        count: { type: "Int", defaultValue: 100 }
        cursor: { type: "String" }
      ) {
        id
        myCollectionInfo {
          includesPurchasedArtworks
        }
        myCollectionConnection(
          excludePurchasedArtworks: $excludePurchasedArtworks
          first: $count
          after: $cursor
          sort: CREATED_AT_DESC
        ) @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          edges {
            node {
              id
              medium
            }
          }
          ...InfiniteScrollArtworksGrid_myCollectionConnection @arguments(skipArtworkGridItem: true)
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyCollectionPaginationQuery($excludePurchasedArtworks: Boolean, $count: Int!, $cursor: String) {
        me {
          ...MyCollection_me
            @arguments(excludePurchasedArtworks: $excludePurchasedArtworks, count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionQueryRenderer: React.FC = () => {
  const enableMyCollectionOrderImport = useFeatureFlag("AREnableMyCollectionOrderImport")
  const excludePurchasedArtworks = !enableMyCollectionOrderImport

  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<MyCollectionQuery>
        environment={defaultEnvironment}
        query={graphql`
          query MyCollectionQuery($excludePurchasedArtworks: Boolean) {
            me {
              ...MyCollection_me @arguments(excludePurchasedArtworks: $excludePurchasedArtworks)
            }
          }
        `}
        variables={{ excludePurchasedArtworks }}
        cacheConfig={{ force: true }}
        render={renderWithPlaceholder({
          Container: MyCollectionContainer,
          renderPlaceholder: () => <LoadingSkeleton />,
        })}
      />
    </ArtworkFiltersStoreProvider>
  )
}

export const LoadingSkeleton: React.FC<{}> = () => {
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between">
        <Spacer />
        <Spacer />
        <PlaceholderText width={70} margin={20} />
      </Flex>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
        <Flex>
          <Spacer mb={40} />
          {/* Entity name */}
          <PlaceholderText width={180} />
          {/* subtitle text */}
          <PlaceholderText width={100} />
        </Flex>
      </Flex>
      <Spacer mb={3} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width="40%" />
        <PlaceholderText width="40%" />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={3} />
      {/* masonry grid */}
      <PlaceholderGrid />
    </Flex>
  )
}

const tracks = {
  addCollectedArtwork,
}
