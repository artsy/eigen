import { addCollectedArtwork, OwnerType } from "@artsy/cohesion"
import AsyncStorage from "@react-native-community/async-storage"
import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { EventEmitter } from "events"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersStoreProvider,
  ArtworksFiltersStore,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/ArtworksFilterHeader"
import { InfiniteScrollMyCollectionArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/Components/constants"
import { ZeroState } from "lib/Components/States/ZeroState"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { useToast } from "lib/Components/Toast/toastHook"
import { navigate, popToRoot } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useDevToggle, useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import _, { filter, orderBy, uniqBy } from "lodash"
import { DateTime } from "luxon"
import { Banner, Button, Flex, Separator, Spacer, useSpace } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { addRandomMyCollectionArtwork } from "./utils/randomMyCollectionArtwork"

const RefreshEvents = new EventEmitter()
const REFRESH_KEY = "refresh"

export function refreshMyCollection() {
  RefreshEvents.emit(REFRESH_KEY)
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
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const filtersCount = useSelectedFiltersCount()

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
        displayText: "Price Paid (High to Low)",
        paramValue: "local-price-paid-high-low",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              return a.pricePaid?.minor
            },
            "asc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Price Paid (Low to High)",
        paramValue: "local-price-paid-low-high",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) =>
          orderBy(
            artworks,
            (a) => {
              return a.pricePaid?.minor
            },
            "desc"
          ),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Artwork Year (Ascending)",
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
        displayText: "Artwork Year (Descending)",
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
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical by Artist (A to Z)",
        paramValue: "local-alpha-a-z",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "asc"),
      },
      {
        paramName: FilterParamName.sort,
        displayText: "Alphabetical by Artist (Z to A)",
        paramValue: "local-alpha-z-a",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks) => orderBy(artworks, (a) => a.artistNames, "desc"),
      },
    ])
    setFilterOptions([
      {
        displayText: FilterDisplayName.sort,
        filterType: "sort",
        ScreenComponent: "SortOptionsScreen",
      },
      {
        displayText: FilterDisplayName.artistIDs,
        filterType: "artistIDs",
        ScreenComponent: "ArtistIDsOptionsScreen",
        values: uniqBy(
          artworks.map(
            (a): FilterData => ({
              displayText: a.artist?.name ?? "N/A",
              paramName: FilterParamName.artistIDs,
              paramValue: a.artist?.internalID ?? "",
            })
          ),
          (m) => m.paramValue
        ),
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks, artistIDs: string[]) =>
          filter(artworks, (a) => artistIDs.includes(a.artist.internalID)),
      },
      {
        displayText: FilterDisplayName.attributionClass,
        filterType: "attributionClass",
        ScreenComponent: "AttributionClassOptionsScreen",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks, attributionClasses: string[]) => {
          return filter(artworks, (a) => {
            if (a.attributionClass && a.attributionClass.name) {
              return attributionClasses.includes(a.attributionClass.name)
            }
            return false
          })
        },
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
          (m) => m.paramValue
        ),
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks, mediums: string[]) =>
          filter(artworks, (a) => mediums.includes(a.medium)),
      },
      {
        displayText: FilterDisplayName.priceRange,
        filterType: "priceRange",
        ScreenComponent: "PriceRangeOptionsScreen",
        // tslint:disable-next-line: no-shadowed-variable
        localSortAndFilter: (artworks, priceRange: string) => {
          const splitRange = priceRange.split("-")
          const lowerBoundStr = splitRange[0]
          const upperBoundStr = splitRange[1]

          let lowerBound = 0
          let upperBound = Number.POSITIVE_INFINITY

          const parsedLower = parseInt(lowerBoundStr, 10)
          const parsedUpper = parseInt(upperBoundStr, 10)

          if (!isNaN(parsedLower)) {
            lowerBound = parsedLower
          }

          if (!isNaN(parsedUpper)) {
            upperBound = parsedUpper
          }

          return filter(artworks, (a) => {
            if (isNaN(a.pricePaid?.minor)) {
              return false
            }
            const pricePaid = a.pricePaid?.minor / 100
            return pricePaid >= lowerBound && pricePaid <= upperBound
          })
        },
      },
      {
        displayText: FilterDisplayName.sizes,
        filterType: "sizes",
        ScreenComponent: "SizesOptionsScreen",

        localSortAndFilter: (
          // tslint:disable-next-line: no-shadowed-variable
          artworks,
          sizeParams: {
            paramName: FilterParamName.width | FilterParamName.height | FilterParamName.sizes
            paramValue: string
          }
        ) => {
          if (sizeParams.paramName === "sizes") {
            return filter(artworks, (a) => {
              const size: string = a.sizeBucket
              return sizeParams.paramValue.includes(size.toUpperCase())
            })
          } else {
            const splitRange = sizeParams.paramValue.split("-")
            const lowerBoundStr = splitRange[0]
            const upperBoundStr = splitRange[1]

            let lowerBound = 0
            let upperBound = Number.POSITIVE_INFINITY

            const parsedLower = parseInt(lowerBoundStr, 10)
            const parsedUpper = parseInt(upperBoundStr, 10)

            if (!isNaN(parsedLower)) {
              lowerBound = parsedLower
            }

            if (!isNaN(parsedUpper)) {
              upperBound = parsedUpper
            }

            return filter(artworks, (a) => {
              const targetMetric = sizeParams.paramName === "width" ? a.width : a.height
              if (isNaN(targetMetric)) {
                return false
              }
              return targetMetric >= lowerBound && targetMetric <= upperBound
            })
          }
        },
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
  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const space = useSpace()
  const toast = useToast()

  const showDevAddButton = useDevToggle("DTEasyMyCollectionArtworkCreation")

  useEffect(() => {
    if (artworks.length) {
      hasBeenShownBanner().then((hasSeenBanner) => {
        const showNewWorksBanner = me.myCollectionInfo?.includesPurchasedArtworks && !hasSeenBanner

        setJSX(
          <Flex>
            <ArtworksFilterHeader
              selectedFiltersCount={filtersCount}
              onFilterPress={() => setFilterModalVisible(true)}
            >
              <Button
                data-test-id="add-artwork-button-non-zero-state"
                size="small"
                variant="fillDark"
                onPress={() => {
                  navigate("my-collection/artworks/new", {
                    passProps: {
                      mode: "add",
                      onSuccess: popToRoot,
                    },
                  })
                  trackEvent(tracks.addCollectedArtwork())
                }}
                haptic
              >
                Add Works
              </Button>
            </ArtworksFilterHeader>
            {!!showNewWorksBanner && (
              <Banner
                title="Your collection is growing"
                text="Based on your purchase history, we’ve added the following works."
                showCloseButton
                onClose={() =>
                  AsyncStorage.setItem(HAS_SEEN_MY_COLLECTION_NEW_WORKS_BANNER, "true")
                }
              />
            )}
          </Flex>
        )
      })
    } else {
      // remove already set JSX
      setJSX(null)
    }
  }, [artworks.length, filtersCount])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.myCollection,
      })}
    >
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
                  trackEvent(tracks.addCollectedArtwork())
                  navigate("my-collection/artworks/new", {
                    passProps: {
                      mode: "add",
                      onSuccess: popToRoot,
                    },
                  })
                }}
                block
              >
                Add artwork
              </Button>
            }
          />
        ) : (
          <Flex pt={1}>
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

                // custom size filters come back with a different type, consolidate to one
                const sizeFilterTypes = [
                  FilterParamName.width,
                  FilterParamName.height,
                  FilterParamName.sizes,
                ]

                // tslint:disable-next-line: no-shadowed-variable
                filtering.forEach((filter) => {
                  if (sizeFilterTypes.includes(filter.paramName)) {
                    /*
                     * Custom handling for size filter
                     * 2 flavors:
                     * a sizeRange representing either a width or height restriction OR
                     * 1 or more size bucket names which should be matched against artwork values
                     * pass the paramName so we can distinguish how to handle in the step
                     */
                    const sizeFilterParamName = FilterParamName.sizes
                    const sizeFilterStep = (filterOptions ?? []).find(
                      (f) => f.filterType === sizeFilterParamName
                    )!.localSortAndFilter!
                    processedArtworks = sizeFilterStep(processedArtworks, {
                      paramValue: filter.paramValue,
                      paramName: filter.paramName,
                    })
                  } else {
                    const filterStep = (filterOptions ?? []).find(
                      (f) => f.filterType === filter.paramName
                    )!.localSortAndFilter!
                    processedArtworks = filterStep(processedArtworks, filter.paramValue)
                  }
                })

                const sorting = appliedFiltersState.filter(
                  (x) => x.paramName === FilterParamName.sort
                )
                if (sorting.length > 0) {
                  const sortStep = sorting[0].localSortAndFilter!
                  processedArtworks = sortStep(processedArtworks)
                }

                return processedArtworks
              }}
            />
          </Flex>
        )}
        {!!showDevAddButton && (
          <Button
            onPress={async () => {
              toast.show("Adding artwork", "middle")
              await addRandomMyCollectionArtwork()
              toast.hideOldest()
            }}
            block
          >
            Add Random Work
          </Button>
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
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
        id
        myCollectionInfo {
          includesPurchasedArtworks
        }
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
          @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          edges {
            node {
              id
              medium
              pricePaid {
                minor
              }
              attributionClass {
                name
              }
              sizeBucket
              width
              height
              artist {
                internalID
                name
              }
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
      query MyCollectionPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollection_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionQueryRenderer: React.FC = () => {
  return (
    <ArtworkFiltersStoreProvider>
      <QueryRenderer<MyCollectionQuery>
        environment={defaultEnvironment}
        query={graphql`
          query MyCollectionQuery {
            me {
              ...MyCollection_me
            }
          }
        `}
        variables={{}}
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
