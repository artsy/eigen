import React from "react"
import { FlatList, RefreshControl } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import Spinner from "lib/Components/Spinner"
import ZeroState from "lib/Components/States/ZeroState"

import { PAGE_SIZE } from "lib/data/constants"

import { Artists_me } from "__generated__/Artists_me.graphql"

interface Props {
  me: Artists_me
  relay: RelayPaginationProp
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

class Artists extends React.Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.setState({ fetchingMoreData: true })
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const rows: any[] = this.props.me.followed_artists_connection.edges.map(e => e.node.artist)

    if (rows.length === 0) {
      return (
        <ZeroState
          title="You haven’t followed any artists yet"
          subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
        />
      )
    }

    return (
      <FlatList
        data={rows}
        keyExtractor={({ __id }) => __id}
        renderItem={item => <SavedItemRow {...item.item} />}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
        ListFooterComponent={
          this.state.fetchingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null
        }
      />
    )
  }
}

export default createPaginationContainer(
  Artists,
  {
    me: graphql`
      fragment Artists_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followed_artists_connection(first: $count, after: $cursor)
          @connection(key: "Artists_followed_artists_connection") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              artist {
                id
                __id
                name
                href
                image {
                  url
                }
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
      return props.me && (props.me.followed_artists_connection as ConnectionData)
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, pageInfo, _fragmentVariables) {
      return pageInfo
    },
    query: graphql`
      query ArtistsMeQuery($count: Int!, $cursor: String) {
        me {
          ...Artists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
