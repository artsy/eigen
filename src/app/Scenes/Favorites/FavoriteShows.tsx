import { FavoriteShowsQuery } from "__generated__/FavoriteShowsQuery.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import { ShowItemRowContainer as ShowItemRow } from "app/Components/Lists/ShowItemRow"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import React, { Component } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

import { FavoriteShows_me$data } from "__generated__/FavoriteShows_me.graphql"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "app/utils/extractNodes"
import { Spacer } from "palette"

interface Props {
  me: FavoriteShows_me$data
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

export class Shows extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.setState({ fetchingMoreData: true })
    this.props.relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Shows/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Shows/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const shows = extractNodes(this.props.me.followsAndSaves?.shows).map((show) => ({
      key: show.id,
      content: <ShowItemRow show={show} isListItem />,
    }))

    if (!shows.length) {
      return (
        <StickyTabPageScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshingFromPull}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <ZeroState
            title="You haven’t saved any shows yet"
            subtitle="When you save shows, they will show up here for future use."
          />
        </StickyTabPageScrollView>
      )
    }

    return (
      <StickyTabPageFlatList
        data={shows}
        style={{ paddingHorizontal: 0 }}
        contentContainerStyle={{ paddingVertical: 15 }}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Spacer mb="5px" />}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshingFromPull}
            onRefresh={this.handleRefresh}
          />
        }
        ListFooterComponent={
          this.state.fetchingMoreData ? (
            <Spinner style={{ marginTop: 20, marginBottom: 20 }} />
          ) : null
        }
      />
    )
  }
}

const FavoriteShowsContainer = createPaginationContainer(
  Shows,
  {
    me: graphql`
      fragment FavoriteShows_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followsAndSaves {
          shows: showsConnection(first: $count, after: $cursor)
            @connection(key: "SavedShows_shows") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
              hasNextPage
            }
            edges {
              node {
                id
                ...ShowItemRow_show
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return props.me && props.me.followsAndSaves.shows
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query FavoriteShowsPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteShows_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteShowsQueryRenderer = () => {
  return (
    <QueryRenderer<FavoriteShowsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FavoriteShowsQuery {
          me {
            ...FavoriteShows_me
          }
        }
      `}
      variables={{
        count: 10,
      }}
      render={renderWithLoadProgress(FavoriteShowsContainer)}
    />
  )
}
