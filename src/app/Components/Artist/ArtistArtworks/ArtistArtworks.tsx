import { useSpace, useScreenDimensions, Flex, Text, Tabs } from "@artsy/palette-mobile"
import { ArtistArtworks_artist$data } from "__generated__/ArtistArtworks_artist.graphql"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { Props as InfiniteScrollGridProps } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import React, { useCallback, useMemo } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist$data
  searchCriteria: SearchCriteriaAttributes | null
  relay: RelayPaginationProp
  predefinedFilters?: FilterArray
}

// type FilterModalOpenedFrom = "sortAndFilter" | "createAlert"

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  // const { showFilterArtworksModal, openFilterArtworksModal, closeFilterArtworksModal } =
  //   useShowArtworksFilterModal({ artist })
  const tracking = useTracking()
  const space = useSpace()
  const { width, height } = useScreenDimensions()
  const artworks = useMemo(() => extractNodes(artist.artworks), [artist.artworks])
  // const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

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

  const loadMoreStuff = useCallback(() => {
    // console.warn("onEndReached")
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(10)
      console.warn("loading more")
    }
  }, [relay.hasMore()])

  return (
    <Tabs.Masonry
      data={artworks}
      numColumns={2}
      estimatedItemSize={272}
      // ListEmptyComponent={
      //   <Box mb="80px" pt={2}>
      //     <FilteredArtworkGridZeroState
      //       id={artist.id}
      //       slug={artist.slug}
      //       trackClear={trackClear}
      //       hideClearButton={!appliedFilters.length}
      //     />
      //   </Box>
      // }
      keyExtractor={(item) => item.id}
      renderItem={({ item, columnIndex }) => {
        const imgAspectRatio = item.image?.aspectRatio ?? 1
        const imgWidth = width / 2 - space(2) - space(1)
        const imgHeight = imgWidth / imgAspectRatio

        return (
          <Flex pl={columnIndex === 1 ? 1 : 0} pr={columnIndex === 0 ? 1 : 0} py={1}>
            <ArtworkGridItem hideUrgencyTags artwork={item} height={imgHeight} />
            {/* <Text>{item.slug}</Text> */}
          </Flex>
        )
      }}
      onEndReached={loadMoreStuff}
    />
  )
}

// interface ArtistArtworksContainerProps {
//   openFilterModal: (openedFrom: FilterModalOpenedFrom) => void
// }

// const ArtistArtworksContainer: React.FC<ArtworksGridProps & ArtistArtworksContainerProps> = ({
//   artist,
//   relay,
//   searchCriteria,
//   predefinedFilters,
//   ...props
// }) => {
//   const tracking = useTracking()
//   const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

//   const { openFilterArtworksModal } = useShowArtworksFilterModal({ artist })

//   const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions(
//     (state) => state.setInitialFilterStateAction
//   )

//   const artworks = artist.artworks
//   const artworksCount = artworks?.edges?.length

//   useArtworkFilters({
//     relay,
//     aggregations: artist.aggregations?.aggregations,
//     componentPath: "ArtistArtworks/ArtistArtworks",
//   })

//   useEffect(() => {
//     let filters: FilterArray = []

//     if (Array.isArray(predefinedFilters)) {
//       filters = predefinedFilters
//     }

//     if (searchCriteria && artist.aggregations?.aggregations) {
//       const params = convertSavedSearchCriteriaToFilterParams(
//         searchCriteria,
//         artist.aggregations.aggregations as Aggregations
//       )
//       const sortFilterItem = ORDERED_ARTWORK_SORTS.find(
//         (sortEntity) => sortEntity.paramValue === "-published_at"
//       )!

//       filters = [...params, sortFilterItem]
//     }

//     setInitialFilterStateAction(filters)
//   }, [])

//   // TODO: Convert to use cohesion
// const trackClear = (id: string, slug: string) => {
//   tracking.trackEvent({
//     action_name: "clearFilters",
//     context_screen: Schema.ContextModules.ArtworkGrid,
//     context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
//     context_screen_owner_id: id,
//     context_screen_owner_slug: slug,
//     action_type: Schema.ActionTypes.Tap,
//   })
// }

//   const filteredArtworks = () => {
//     if (artworksCount === 0) {
//       return (
//         <Box mb="80px" pt={2}>
//           <FilteredArtworkGridZeroState
//             id={artist.id}
//             slug={artist.slug}
//             trackClear={trackClear}
//             hideClearButton={!appliedFilters.length}
//           />
//         </Box>
//       )
//     } else {
//       return (
//         <>
//           <Spacer y={2} />
//           <InfiniteScrollArtworksGrid
//             connection={artist.artworks!}
//             loadMore={relay.loadMore}
//             hasMore={relay.hasMore}
//             {...props}
//             contextScreenOwnerType={OwnerType.artist}
//             contextScreenOwnerId={artist.internalID}
//             contextScreenOwnerSlug={artist.slug}
//           />
//         </>
//       )
//     }
//   }

//   if (!artist.statuses?.artworks) {
//     return (
//       <>
//         <Spacer y={6} />

//         <Text variant="md" textAlign="center">
//           Get notified when new works are available
//         </Text>

//         <Text variant="md" textAlign="center" color="black60">
//           There are currently no works for sale for this artist. Create an alert, and we’ll let you
//           know when new works are added.
//         </Text>

//         <Spacer y={2} />

//         <Button
//           variant="outline"
//           mx="auto"
//           icon={<BellIcon />}
//           onPress={() => {
//             openFilterArtworksModal("createAlert")

//             tracking.trackEvent({
//               action: ActionType.tappedCreateAlert,
//               context_screen_owner_type: OwnerType.artist,
//               context_screen_owner_id: artist.internalID,
//               context_screen_owner_slug: artist.slug,
//               context_module: ContextModule.artworkGrid,
//             })
//           }}
//         >
//           Create Alert
//         </Button>

//         <Spacer y={6} />
//       </>
//     )
//   }

//   return artist.artworks ? filteredArtworks() : null
// }

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
        ...ArtistArtworksFilterHeader_artist
        id
        slug
        name
        internalID
        aggregations: filterArtworksConnection(
          first: 0
          aggregations: [
            COLOR
            DIMENSION_RANGE
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
            PRICE_RANGE
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
        artworks: filterArtworksConnection(first: $count, after: $cursor, input: $input)
          @connection(key: "ArtistArtworksGrid_artworks") {
          edges {
            node {
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
              # ...MyCollectionArtworkGridItem_artwork
              # @skip(if: $skipMyCollection)
              # @arguments(includeAllImages: false)
            }
          }
          counts {
            total
          }
          # ...InfiniteScrollArtworksGrid_connection
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
        }
        statuses {
          artworks
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
      query ArtistArtworksQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)
