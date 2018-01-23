import React, { Component } from "react"
import { ScrollView } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import ZeroState from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

interface Props extends RelayProps {
  relay?: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
}

export class SavedWorks extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
  }

  loadMore = () => {
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
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Artworks/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  render() {
    const artworks = this.props.me.saved_artworks.artworks_connection.edges.map(edge => edge.node)

    if (artworks.length === 0) {
      return (
        <ZeroState
          title="You haven’t followed any artists yet"
          subtitle="Follow artists to get notified about new works that have been added to Artsy."
        />
      )
    }

    return (
      <ScrollView
        onScroll={isCloseToBottom(this.loadMore)}
        scrollEventThrottle={400}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
      >
        <GenericGrid artworks={artworks} isLoading={this.state.fetchingMoreData} />
      </ScrollView>
    )
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
    getConnectionFromProps(props) {
      return props.me && props.me.saved_artworks.artworks_connection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
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
