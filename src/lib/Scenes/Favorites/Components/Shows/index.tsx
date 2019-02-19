import ZeroState from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import React, { Component } from "react"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import { Shows_me } from "__generated__/Shows_me.graphql"

interface Props {
  me: Shows_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
}

export class SavedShows extends Component<Props, State> {
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
    return (
      <ZeroState
        title="You haven’t followed any shows yet"
        subtitle="Follow shows to get notified about new shows that have been added to Artsy."
      />
    )
  }
}

export default createPaginationContainer(
  SavedShows,
  {
    me: graphql`
      fragment Shows_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        followsAndSaves {
          shows(first: $count, after: $cursor) @connection(key: "SavedShows_shows") {
            edges {
              node {
                name
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
