import React, { Component } from "react"
import { ScrollView } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import ZeroState from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { Shows_me } from "__generated__/Shows_me.graphql"

interface Props {
  me: Shows_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}
ß
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
        console.error("Shows/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  render() {
    const Shows = this.props.me.saved_Shows.Shows_connection.edges.map(edge => edge.node)

    if (Shows.length === 0) {
      return (
        <ZeroState
          title="You haven’t followed any shows or fairs yet"
          subtitle="Follow shows or fairs to get notified about new events that have been added to Artsy."
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
        {/*ADD FOLLOWED SHOWS AND FAIRS HERE*/}
      </ScrollView>
    )
  }
}

// export default createPaginationContainer(
//   SavedShows,
//   {
//     me: graphql`
//       fragment Shows_me on Me
//         @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
//         saved_Shows {
//           Shows_connection(private: true, first: $count, after: $cursor)
//             @connection(key: "GenericGrid_Shows_connection") {
//             pageInfo {
//               endCursor
//               hasNextPage
//             }
//             edges {
//               node {
//                 ...GenericGrid_Shows
//               }
//             }
//           }
//         }
//       }
//     `,
//   },
//   {
//     direction: "forward",
//     getConnectionFromProps(props) {
//       return props.me && (props.me.saved_Shows.Shows_connection as ConnectionData)
//     },
//     getFragmentVariables(prevVars, totalCount) {
//       return {
//         ...prevVars,
//         count: totalCount,
//       }
//     },
//     getVariables(_props, { count, cursor }, fragmentVariables) {
//       return {
//         ...fragmentVariables,
//         count,
//         cursor,
//       }
//     },
//     query: graphql`
//       query ShowsQuery($count: Int!, $cursor: String) {
//         me {
//           ...Shows_me @arguments(count: $count, cursor: $cursor)
//         }
//       }
//     `,
//   }
// )
