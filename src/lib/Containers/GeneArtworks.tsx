import { GeneArtworks_gene } from '__generated__/GeneArtworks_gene.graphql'
import { StickyTabPageFlatListContext } from 'lib/Components/StickyTabPage/StickyTabPageFlatList'
import { Box, Button, Flex, Sans } from "palette"
import React, { useContext } from "react"
import { useEffect } from 'react'
import { StyleSheet, ViewStyle } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "../Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import Separator from "../Components/Separator"

interface GeneArtworsProps {
  gene: GeneArtworks_gene
  relay: RelayPaginationProp
}

export const GeneArtwors: React.FC<GeneArtworsProps> = (props) => {
  const { gene } = props

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  useEffect(
    () => {
      setJSX(
        <Box backgroundColor="white" px={2} paddingTop={15}>
          <Separator style={{ backgroundColor: "white" }} />
          <Flex style={styles.refineContainer}>
            <Sans size="3t" color="black60" marginTop="2px">
              Some example text
            </Sans>
            <Button variant="secondaryOutline" onPress={() => {}} size="small">
              Refine
            </Button>
          </Flex>
          <Separator style={{ backgroundColor: "white" }} />
        </Box>
      )
    },
    []
  )

  // TODO: Show message for empty artworks
  return (
    <InfiniteScrollArtworksGrid
      connection={gene.artworks!}
      hasMore={props.relay.hasMore}
      loadMore={props.relay.loadMore}
    />
  )
}

export const GeneArtworksPaginationContainer = createPaginationContainer(
  GeneArtwors,
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
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL],
          forSale: true,
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
          # TODO: Just to satisfy relay-compiler
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
      query GeneArtworksPaginationQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        node(id: $id) {
          ... on Gene {
            ...GeneArtworks_gene
              @arguments(count: $count, cursor: $cursor, input: $input)
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
