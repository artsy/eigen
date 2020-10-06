import { SaleLotsList2_saleArtworksConnection } from "__generated__/SaleLotsList2_saleArtworksConnection.graphql"
import { Flex, Sans } from "palette"
import React from "react"
import { createPaginationContainer, graphql } from "react-relay"

interface Props {
  saleArtworksConnection: SaleLotsList2_saleArtworksConnection
}

export const SaleLotsList2: React.FC<Props> = (saleProps) => {
  console.log({ saleProps })

  const FiltersResume = () => (
    <Flex px={2} mb={1}>
      <Sans size="4" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
        Sorted by lot number (ascending)
      </Sans>

      <Sans size="3t" color="black60" data-test-id="subtitle">
        Showing 84 of 84 lots
      </Sans>
    </Flex>
  )

  return (
    <Flex flex={1} my={4}>
      <FiltersResume />
    </Flex>
  )
}

export const SaleLotsList2Container = createPaginationContainer(
  SaleLotsList2,
  {
    saleArtworksConnection: graphql`
      fragment SaleLotsList2_saleArtworksConnection on Query
      @argumentDefinitions(count: { type: "Int!" }, cursor: { type: "String" }) {
        saleArtworksConnection: saleArtworksConnection(first: $count, after: $cursor)
        @connection(key: "SaleLotsList2_saleArtworksConnection") {
          edges {
            node {
              title
            }
          }
          totalCount
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.saleArtworksConnection.saleArtworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsList2Query($count: Int!, $cursor: String) @raw_response_type {
        ...SaleLotsList2_saleArtworksConnection @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)
