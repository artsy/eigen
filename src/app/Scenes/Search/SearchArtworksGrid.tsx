import { SearchArtworksGrid_viewer$data } from "__generated__/SearchArtworksGrid_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import { Artwork } from "app/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { Masonry } from "app/Components/VirtualizedMasonry"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { Box, quoteLeft, quoteRight, Text, useTheme } from "palette"
import { useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { Dimensions } from "react-native"

export interface SearchArtworksGridProps {
  viewer: SearchArtworksGrid_viewer$data
  relay: RelayPaginationProp
  keyword: string
}

const SearchArtworksGrid: React.FC<SearchArtworksGridProps> = ({ viewer, relay, keyword }) => {
  const { space } = useTheme()
  const { trackEvent } = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setFiltersCountAction
  )

  const handleCloseFilterArtworksModal = (withFiltersApplying: boolean = false) => {
    if (!withFiltersApplying) {
      trackEvent(tracks.closeFilterModal())
    }
    setFilterArtworkModalVisible(false)
  }
  const handleOpenFilterArtworksModal = () => {
    trackEvent(tracks.openFilterModal())
    setFilterArtworkModalVisible(true)
  }

  const artworksCount = viewer.artworks?.edges?.length
  const appliedFiltersCount = useSelectedFiltersCount()

  useArtworkFilters({
    relay,
    aggregations: viewer.artworks?.aggregations,
    componentPath: "Search/SearchArtworksGrid",
  })

  useEffect(() => {
    if (viewer.artworks?.counts) {
      setFiltersCountAction({
        followedArtists: viewer.artworks.counts.followedArtists,
        total: null,
      })
    }
  }, [setFiltersCountAction])

  return (
    <>
      <ArtworkFilterNavigator
        query={keyword}
        visible={isFilterArtworksModalVisible}
        exitModal={() => handleCloseFilterArtworksModal(true)}
        closeModal={handleCloseFilterArtworksModal}
        mode={FilterModalMode.Search}
      />
      <ArtworksFilterHeader
        selectedFiltersCount={appliedFiltersCount}
        onFilterPress={handleOpenFilterArtworksModal}
      />
      {artworksCount === 0 ? (
        <Box mb="80px" pt={6}>
          <Box px={2}>
            <Text variant="md" textAlign="center">
              Sorry, we couldn’t find any Artworks for {quoteLeft}
              {keyword}.{quoteRight}
            </Text>
            <Text variant="md" color="black60" textAlign="center">
              Please try searching again with a different spelling.
            </Text>
          </Box>
        </Box>
      ) : (
        <Masonry
          data={extractNodes(viewer.artworks!)}
          width={Dimensions.get("window").width - 2 * space(2)} // the two spaces are for the horizontal padding below.
          contentContainerStyle={{ paddingTop: space(2), paddingHorizontal: space(2) }}
          gutter={20}
          renderItem={({ item }) => (
            <Artwork
              artwork={item as any} // FIXME: Types are messed up here
              // hideUrgencyTags={hideUrgencyTags}
              // hidePartner={hidePartner}
              // showLotLabel={showLotLabel}
              // itemIndex={item.id}
              // updateRecentSearchesOnTap={updateRecentSearchesOnTap}
              {...item}
            />
          )}
          keyExtractor={({ id }) => id}
          getBrickHeight={(item, brickWidth) => {
            const textHeight = 80 /* thats a bad hardcode, but its roughly the size of the text that we usually have under the artwork */
            return (brickWidth ?? 0) / (item.image?.aspectRatio ?? 1) + textHeight
          }}
          onEndReached={() => console.warn("reached")}
        />
      )}
    </>
  )
}

export const SearchArtworksGridPaginationContainer = createPaginationContainer(
  SearchArtworksGrid,
  {
    viewer: graphql`
      fragment SearchArtworksGrid_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        keyword: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworks: artworksConnection(
          first: $count
          after: $cursor
          keyword: $keyword
          aggregations: [
            ARTIST
            MEDIUM
            PRICE_RANGE
            DIMENSION_RANGE
            MATERIALS_TERMS
            ARTIST_NATIONALITY
            LOCATION_CITY
            MAJOR_PERIOD
            COLOR
            PARTNER
            FOLLOWED_ARTISTS
          ]
          input: $input
        ) @connection(key: "SearchArtworksGrid_artworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          counts {
            followedArtists
          }
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              title
              date
              saleMessage
              slug
              internalID
              artistNames
              href
              sale {
                isAuction
                isClosed
                displayTimelyAt
                cascadingEndTimeIntervalMinutes
                extendedBiddingPeriodMinutes
                extendedBiddingIntervalMinutes
                endAt
                startAt
              }
              saleArtwork {
                counts {
                  bidderPositions
                }
                formattedEndDateTime
                currentBid {
                  display
                }
                lotID
                lotLabel
                endAt
                extendedBiddingEndAt
              }
              partner {
                name
              }
              image {
                url(version: "large")
                aspectRatio
              }
              realizedPrice
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query SearchArtworksGridQuery(
        $count: Int!
        $cursor: String
        $keyword: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...SearchArtworksGrid_viewer
            @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
        }
      }
    `,
  }
)

const tracks = {
  openFilterModal: () => ({
    action_name: "filter",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterModal: () => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: OwnerEntityTypes.Search,
    context_screen: PageNames.Search,
    context_screen_owner_id: null,
    context_screen_owner_slug: null,
    action_type: Schema.ActionTypes.Tap,
  }),
}
