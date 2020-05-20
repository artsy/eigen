import { color, FilterIcon, Flex, Sans } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { filterArtworksParams } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFiltersStore"
import React, { useContext, useEffect, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
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
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {value => {
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
                    isFilterCountVisible={value.state.appliedFilters.length > 0 ? true : false}
                  >
                    <FilterIcon fill="white100" />
                    <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
                      Filter
                    </Sans>
                    {value.state.appliedFilters.length > 0 && (
                      <>
                        <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                          {"\u2022"}
                        </Sans>
                        <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
                          {value.state.appliedFilters.length}
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
  const { state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)

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

  return artist.artworks ? (
    <>
      <ArtistCollectionsRailFragmentContainer collections={artist.iconicCollections} artist={artist} {...props} />
      <InfiniteScrollArtworksGrid
        // @ts-ignore STRICTNESS_MIGRATION
        connection={artist.artworks}
        loadMore={relay.loadMore}
        {...props}
      />
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
          priceRange: { type: "String", defaultValue: "" }
          majorPeriods: { type: "[String]" }
          acquireable: { type: "Boolean", defaultValue: true }
          inquireableOnly: { type: "Boolean", defaultValue: true }
          atAuction: { type: "Boolean", defaultValue: true }
          offerable: { type: "Boolean", defaultValue: true }
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
          majorPeriods: $majorPeriods
          acquireable: $acquireable
          inquireableOnly: $inquireableOnly
          atAuction: $atAuction
          offerable: $offerable
          aggregations: [TOTAL]
        ) @connection(key: "ArtistArtworksGrid_artworks") {
          # TODO: Just here to satisfy the relay compiler, can we get rid of this need?
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
        priceRange: fragmentVariables.priceRange,
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
                priceRange: $priceRange
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
