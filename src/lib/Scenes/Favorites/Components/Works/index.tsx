import React from "react"
import { View } from "react-native"
import { createPaginationContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"

const Container = styled.ScrollView`
  padding: 20px;
  flex: 1;
`

class SavedWorks extends React.Component<RelayProps, null> {
  render() {
    const artworks = this.props.me.saved_artworks.artworks_connection.edges.map(edge => edge.node)
    return (
      <Container>
        <GenericGrid artworks={artworks} />
      </Container>
    )
  }
}

export default createPaginationContainer(
  SavedWorks,
  {
    me: graphql.experimental`
      fragment Works_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        saved_artworks {
          artworks_connection(private: true, first: $count, after: $cursor)
            @connection(key: "GenericGrid_artworks_connection") {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.me && props.me.saved_artworks_connection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql.experimental`
      query WorksQuery($count: Int!, $cursor: String) {
        me {
          ...Works_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

interface RelayProps {
  me: {
    saved_artworks: {
      artworks_connection: {
        edges: Array<{
          node: any | null
        } | null>
      }
    } | null
  } | null
}
