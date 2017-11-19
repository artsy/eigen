import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import ZeroState from "lib/Components/States/ZeroState"

class Artists extends React.Component<RelayProps, null> {
  render() {
    const rows: any[] = this.props.me.followed_artists_connection.edges.map(e => e.node.artist)
    const EmptyState = (
      <ZeroState
        title="You haven’t followed any artists yet"
        subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
      />
    )

    const loadMore = () => {
      if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
        return
      }

      this.props.relay.loadMore(10, () => undefined)
    }

    const ArtistsList = (
      <FlatList
        data={rows}
        keyExtractor={({ __id }) => __id}
        renderItem={item => <SavedItemRow {...item.item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
      />
    )

    return rows.length ? ArtistsList : EmptyState
  }
}

export default createPaginationContainer<RelayProps>(
  Artists,
  {
    me: graphql.experimental`
      fragment Artists_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followed_artists_connection(first: $count, after: $cursor)
          @connection(key: "Artists_followed_artists_connection") {
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
      return props.me && props.me.followed_artists_connection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, pageInfo, fragmentVariables) {
      return pageInfo
    },
    query: graphql.experimental`
      query ArtistsMeQuery($count: Int!, $cursor: String) {
        me {
          ...Artists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

interface RelayProps {
  relay?: RelayPaginationProp
  me: {
    followed_artists_connection: {
      edges: any[]
    } | null
  } | null
}
