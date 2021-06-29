import { GeneArtworks_gene } from "__generated__/GeneArtworks_gene.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { filterArtworksParams, prepareFilterArtworksParamsForInput } from 'lib/Components/ArtworkFilter/ArtworkFilterHelpers'
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from 'lib/data/constants'
import { Box, Button, Flex, Sans } from "palette"
import React, { useContext, useState } from "react"
import { useEffect } from "react"
import { StyleSheet, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "../Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import Separator from "../Components/Separator"

interface GeneArtworksContainerProps {
  gene: GeneArtworks_gene
  relay: RelayPaginationProp
}

interface GeneArtworsProps extends GeneArtworksContainerProps {
  openFilterModal: () => void
}

export const GeneArtwors: React.FC<GeneArtworsProps> = (props) => {
  const { gene, relay, openFilterModal } = props
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterParams = filterArtworksParams(appliedFilters, 'categoryArtwork')

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Gene/GeneArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (gene.artworks?.aggregations) {
      setAggregationsAction(gene.artworks.aggregations)
    }
  }, [])

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white" px={2} paddingTop={15}>
        <Separator style={{ backgroundColor: "white" }} />
        <Flex style={styles.refineContainer}>
          <Sans size="3t" color="black60" marginTop="2px">
            Some example text
          </Sans>
          <Button variant="secondaryOutline" onPress={openFilterModal} size="small">
            Refine
          </Button>
        </Flex>
        <Separator style={{ backgroundColor: "white" }} />
      </Box>
    )
  }, [openFilterModal])

  // TODO: Show message for empty artworks
  return (
    <InfiniteScrollArtworksGrid
      connection={gene.artworks!}
      hasMore={props.relay.hasMore}
      loadMore={props.relay.loadMore}
    />
  )
}

const GeneArtworsContainer: React.FC<GeneArtworksContainerProps> = (props) => {
  const { gene } = props
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView disableScrollViewPanResponder>
        <GeneArtwors {...props} openFilterModal={handleOpenFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={gene.internalID}
          slug={gene.slug}
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={handleCloseFilterArtworksModal}
          mode={FilterModalMode.Category}
        />
      </StickyTabPageScrollView>
    </ArtworkFiltersStoreProvider>
  )
}

export const GeneArtworksPaginationContainer = createPaginationContainer(
  GeneArtworsContainer,
  {
    gene: graphql`
      fragment GeneArtworks_gene on Gene
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
          forSale: true
          input: $input
        ) @connection(key: "GeneArtworksGrid_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
            }
          }
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.gene.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.gene.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query GeneArtworksPaginationQuery($id: ID!, $count: Int!, $cursor: String, $input: FilterArtworksInput) {
        node(id: $id) {
          ... on Gene {
            ...GeneArtworks_gene @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)

interface Styles {
  refineContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  refineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 26,
    marginBottom: 12,
  },
})
