import React from "react"
import { View } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import ZeroState from "lib/Components/States/ZeroState"

const Container = styled.ScrollView`
  padding: 20px;
  flex: 1;
`

interface Props extends RelayProps {
  relay?: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

export class SavedWorks extends React.Component<Props, any> {
  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    const updateState = (loading: boolean) => {
      this.setState({ fetchingMoreData: loading })
      if (this.props.onDataFetching) {
        this.props.onDataFetching(loading)
      }
    }

    updateState(true)
    this.props.relay.loadMore(10, e => {
      updateState(false)
    })
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  render() {
    const artworks = this.props.me.saved_artworks.artworks_connection.edges.map(edge => edge.node)

    const EmptyState = (
      <ZeroState
        title="You haven’t followed any artists yet"
        subtitle="Follow artists to get notified about new works that have been added to Artsy."
      />
    )

    const Content = (
      <Container
        onScroll={({ nativeEvent }) => {
          if (this.isCloseToBottom(nativeEvent)) {
            this.loadMore()
          }
        }}
        scrollEventThrottle={400}
      >
        <GenericGrid artworks={artworks} />
      </Container>
    )

    return artworks.length ? Content : EmptyState
  }
}

export default createPaginationContainer(
  SavedWorks,
  {
    me: graphql.experimental`
      fragment Artworks_me on Me
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
    getConnectionFromProps(props: Props) {
      return props.me && props.me.saved_artworks.artworks_connection
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
      query ArtworksQuery($count: Int!, $cursor: String) {
        me {
          ...Artworks_me @arguments(count: $count, cursor: $cursor)
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
        }> | null
      } | null
    } | null
  } | null
}
