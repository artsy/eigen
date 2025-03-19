import { Flex, Spacer, Tabs } from "@artsy/palette-mobile"
import { FavoriteShowsQuery } from "__generated__/FavoriteShowsQuery.graphql"
import { FavoriteShows_me$data } from "__generated__/FavoriteShows_me.graphql"
import { ShowItemRowContainer as ShowItemRow } from "app/Components/Lists/ShowItemRow"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Component } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

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
    const shows = extractNodes(this.props.me.followsAndSaves?.shows)

    if (!shows.length) {
      return (
        <Tabs.ScrollView
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
        </Tabs.ScrollView>
      )
    }

    return (
      <Tabs.FlatList
        data={shows}
        style={{ paddingHorizontal: 0 }}
        contentContainerStyle={{ paddingVertical: 15 }}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Spacer y={0.5} />}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshingFromPull}
            onRefresh={this.handleRefresh}
          />
        }
        ListFooterComponent={
          this.state.fetchingMoreData ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : (
            <Spacer y={2} />
          )
        }
        renderItem={({ item }) => {
          return <ShowItemRow show={item} isListItem />
        }}
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
      return props?.me?.followsAndSaves?.shows
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
      environment={getRelayEnvironment()}
      query={graphql`
        query FavoriteShowsQuery {
          me {
            ...FavoriteShows_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(FavoriteShowsContainer)}
    />
  )
}
