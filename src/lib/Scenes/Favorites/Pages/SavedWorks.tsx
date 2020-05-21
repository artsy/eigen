import React, { Component } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

import { GenericGridContainer } from "lib/Components/ArtworkGrids/GenericGrid"
import { ZeroState } from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"

import { Button } from "@artsy/palette"
import { SavedWorks_me } from "__generated__/SavedWorks_me.graphql"
import { SavedWorksQuery } from "__generated__/SavedWorksQuery.graphql"
import { SwitchBoard } from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithLoadProgress } from "lib/utils/renderWithLoadProgress"

interface Props {
  me: SavedWorks_me
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

class SavedWorks extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
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
        console.error("SavedWorks/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const artworks = this.props.me.followsAndSaves?.artworks?.edges?.map(edge => edge?.node) ?? []

    if (artworks.length === 0) {
      return (
        <ZeroState
          title="You haven’t saved any works yet"
          subtitle="Tap the heart on an artwork to save for later."
          callToAction={
            <Button
              variant="secondaryOutline"
              size="large"
              onPress={() => {
                SwitchBoard.presentNavigationViewController(this, "/")
              }}
            >
              Browse works for you
            </Button>
          }
        />
      )
    }

    return (
      <ScrollView
        onScroll={isCloseToBottom(this.loadMore)}
        scrollEventThrottle={400}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={this.state.refreshingFromPull} onRefresh={this.handleRefresh} />}
      >
        <GenericGridContainer artworks={artworks as any} isLoading={this.state.fetchingMoreData} />
      </ScrollView>
    )
  }
}

const SavedWorksContainer = createPaginationContainer(
  SavedWorks,
  {
    me: graphql`
      fragment SavedWorks_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        # TODO: This should move into followsAndSaves
        followsAndSaves {
          artworks: artworksConnection(private: true, first: $count, after: $cursor)
            @connection(key: "GenericGrid_artworks") {
            pageInfo {
              startCursor
              endCursor
              hasPreviousPage
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
      return props.me.followsAndSaves?.artworks
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
      query SavedWorksPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...SavedWorks_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const SavedWorksRenderer = () => {
  return (
    <QueryRenderer<SavedWorksQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedWorksQuery {
          me {
            ...SavedWorks_me
          }
        }
      `}
      variables={{
        count: 10,
      }}
      render={renderWithLoadProgress(SavedWorksContainer)}
    />
  )
}
