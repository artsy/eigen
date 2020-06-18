import { Box, color, FilterIcon, Flex, Sans, Separator, Spacer } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtistNotableWorksRailFragmentContainer } from "lib/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { filterArtworksParams } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFiltersStore"
import { Schema } from "lib/utils/track"
import React, { useContext, useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { ArtistCollectionsRailFragmentContainer } from "./ArtistCollectionsRail"

// TODO: These should probably be shared components, also used for collections
// Should we replace existing FilterArtworkButton in "lib/Components/FilterModal"?
export const FilterArtworkButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 20;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const FilterArtworkButton = styled(Flex)<{ isFilterCountVisible: boolean }>`
  border-radius: 20;
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  relay: RelayPaginationProp
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const openFilterArtworksModal = () => {
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    handleFilterArtworksModal()
  }

  return (
    <ArtworkFilterGlobalStateProvider aggregations={artist.artworks?.aggregations as any}>
      <ArtworkFilterContext.Consumer>
        {context => {
          return (
            <>
              <StickyTabPageScrollView>
                <ArtistArtworksContainer {...props} artist={artist} relay={relay} />
                <FilterModalNavigator
                  {...props}
                  id={artist.id}
                  slug={artist.slug}
                  isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                  exitModal={handleFilterArtworksModal}
                  closeModal={closeFilterArtworksModal}
                />
              </StickyTabPageScrollView>
              <FilterArtworkButtonContainer>
                <TouchableWithoutFeedback onPress={openFilterArtworksModal}>
                  <FilterArtworkButton
                    px="2"
                    isFilterCountVisible={context.state.appliedFilters.length > 0 ? true : false}
                  >
                    <FilterIcon fill="white100" />
                    <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
                      Filter
                    </Sans>
                    {context.state.appliedFilters.length > 0 && (
                      <>
                        <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                          {"\u2022"}
                        </Sans>
                        <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                          {context.state.appliedFilters.length}
                        </Sans>
                      </>
                    )}
                  </FilterArtworkButton>
                </TouchableWithoutFeedback>
              </FilterArtworkButtonContainer>
            </>
          )
        }}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

const ArtistArtworksContainer: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const tracking = useTracking()
  const { state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)
  const artworks = artist.artworks
  const artworksTotal = artworks?.edges?.length

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        error => {
          if (error) {
            throw new Error("Collection/CollectionArtworks sort: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  // TODO: Convert to use cohesion
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

  const filteredArtworks = () => {
    if (artworksTotal === 0) {
      return (
        <Box>
          <Separator />
          <FilteredArtworkGridZeroState id={artist.id} slug={artist.slug} trackClear={trackClear} />
        </Box>
      )
    } else {
      return (
        <>
          <Box mx={"-20px"} mb={3} mt={1}>
            <Separator />
          </Box>
          <InfiniteScrollArtworksGrid
            connection={artist.artworks}
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            isLoading={relay.isLoading}
            {...props}
          />
        </>
      )
    }
  }

  return artist.artworks ? (
    <>
      <Spacer mb={2} />
      <ArtistNotableWorksRailFragmentContainer artist={artist} {...props} />
      <ArtistCollectionsRailFragmentContainer collections={artist.iconicCollections} artist={artist} {...props} />
      {filteredArtworks()}
    </>
  ) : null
}

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          sort: { type: "String", defaultValue: "-decayed_merch" }
          medium: { type: "String", defaultValue: "*" }
          priceRange: { type: "String" }
          color: { type: "String" }
          partnerID: { type: "ID" }
          dimensionRange: { type: "String", defaultValue: "*-*" }
          majorPeriods: { type: "[String]" }
          acquireable: { type: "Boolean" }
          inquireableOnly: { type: "Boolean" }
          atAuction: { type: "Boolean" }
          offerable: { type: "Boolean" }
        ) {
        id
        slug
        internalID
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          sort: $sort
          medium: $medium
          priceRange: $priceRange
          color: $color
          partnerID: $partnerID
          dimensionRange: $dimensionRange
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
        ) @connection(key: "ArtistArtworksGrid_artworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }

        ...ArtistCollectionsRail_artist

        iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
          ...ArtistCollectionsRail_collections
        }

        ...ArtistNotableWorksRail_artist
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.artist && props.artist.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        id: props.artist.id,
        count,
        cursor,
        sort: fragmentVariables.sort,
        medium: fragmentVariables.medium,
        color: fragmentVariables.color,
        partnerID: fragmentVariables.partnerID,
        priceRange: fragmentVariables.priceRange,
        dimensionRange: fragmentVariables.dimensionRange,
        majorPeriods: fragmentVariables.majorPeriods,
        acquireable: fragmentVariables.acquireable,
        inquireableOnly: fragmentVariables.inquireableOnly,
        atAuction: fragmentVariables.atAuction,
        offerable: fragmentVariables.offerable,
      }
    },
    query: graphql`
      query ArtistArtworksQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $sort: String
        $medium: String
        $priceRange: String
        $color: String
        $partnerID: ID
        $dimensionRange: String
        $majorPeriods: [String]
        $acquireable: Boolean
        $inquireableOnly: Boolean
        $atAuction: Boolean
        $offerable: Boolean
      ) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist
              @arguments(
                count: $count
                cursor: $cursor
                sort: $sort
                medium: $medium
                color: $color
                partnerID: $partnerID
                priceRange: $priceRange
                dimensionRange: $dimensionRange
                majorPeriods: $majorPeriods
                acquireable: $acquireable
                inquireableOnly: $inquireableOnly
                atAuction: $atAuction
                offerable: $offerable
              )
          }
        }
      }
    `,
  }
)
