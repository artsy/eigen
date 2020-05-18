import { color, FilterIcon, Flex, Sans } from "@artsy/palette"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFiltersStore"
import React, { useState } from "react"
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

interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: any
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  relay: RelayPaginationProp
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const [isFilterButtonVisible, setFilterButtonVisible] = useState(false)
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const viewabilityConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 0, // What percentage of the artworks component should be in the screen before toggling the filter button
  })

  // TODO: This is only being called once, why?
  const onViewableItemsChangedRef = React.useRef((viewableItems: ViewableItems) => {
    return setFilterButtonVisible(!isFilterButtonVisible)
  })

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
              <StickyTabPageScrollView
                onViewableItemsChanged={onViewableItemsChangedRef.current}
                viewabilityConfig={viewabilityConfigRef.current}
              >
                <ArtistCollectionsRailFragmentContainer
                  collections={artist.iconicCollections}
                  artist={artist}
                  {...props}
                />
                <InfiniteScrollArtworksGrid
                  // @ts-ignore STRICTNESS_MIGRATION
                  connection={artist.artworks}
                  loadMore={relay.loadMore}
                  {...props}
                />
                <FilterModalNavigator
                  {...props}
                  id={artist.id}
                  slug={artist.slug}
                  isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                  exitModal={handleFilterArtworksModal}
                  closeModal={closeFilterArtworksModal}
                />
              </StickyTabPageScrollView>
              {isFilterButtonVisible && (
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
              )}
            </>
          )
        }}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        slug
        internalID
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          sort: "-decayed_merch"
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
    getVariables(props, { count, cursor }, { filter }) {
      return {
        id: props.artist.id,
        count,
        cursor,
        filter,
      }
    },
    query: graphql`
      query ArtistArtworksQuery($id: ID!, $count: Int!, $cursor: String) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `,
  }
)
