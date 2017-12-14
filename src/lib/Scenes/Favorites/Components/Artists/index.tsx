import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import ZeroState from "lib/Components/States/ZeroState"

import { PAGE_SIZE } from "lib/data/constants"

class Artists extends React.Component<RelayProps> {
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

      this.props.relay.loadMore(PAGE_SIZE, error => {
        if (error) {
          // FIXME: Handle error
          console.error("Artists/index.tsx", error.message)
        }
      })
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
      return props.me && props.me.followed_artists_connection
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
