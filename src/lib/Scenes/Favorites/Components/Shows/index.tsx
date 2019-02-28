import { SavedShowItemRowContainer as SavedShowItemRow } from "lib/Components/Lists/SavedShowItemRow"
import Spinner from "lib/Components/Spinner"
import ZeroState from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import React, { Component } from "react"
import { FlatList } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { Box, Separator, Theme } from "@artsy/palette"
import { Shows_me } from "__generated__/Shows_me.graphql"

interface Props {
  me: Shows_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
}

export class Shows extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.setState({ fetchingMoreData: true })
    this.props.relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("Shows/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  render() {
    const shows = this.props.me.followsAndSaves.shows.edges.map(edge => edge.node)

    if (shows.length === 0 || !shows) {
      return <ZeroState title="You haven’t followed any shows yet" />
    }

    return (
      <Theme>
        <Box px={2}>
          <FlatList
            data={shows}
            keyExtractor={item => item.__id}
            renderItem={item => <SavedShowItemRow show={item.item} />}
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.2}
            ItemSeparatorComponent={() => <Separator />}
            ListFooterComponent={
              this.state.fetchingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null
            }
          />
        </Box>
      </Theme>
    )
  }
}

export default createPaginationContainer(
  Shows,
  {
    me: graphql`
      fragment Shows_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followsAndSaves {
          shows(first: $count, after: $cursor) @connection(key: "SavedShows_shows") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
            edges {
              node {
                ...SavedShowItemRow_show
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
      return props.me && (props.me.followsAndSaves.shows as ConnectionData)
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
    query: graphql`
      query ShowsQuery($count: Int!, $cursor: String) {
        me {
          ...Shows_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
