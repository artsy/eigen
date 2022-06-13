import { FavoriteArtworks_me$data } from "__generated__/FavoriteArtworks_me.graphql"
import { FavoriteArtworksQuery } from "__generated__/FavoriteArtworksQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ZeroState } from "app/Components/States/ZeroState"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { FAVORITE_ARTWORKS_REFRESH_KEY, RefreshEvents } from "app/utils/refreshHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Button, ClassTheme } from "palette"
import React, { Component } from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface Props {
  me: FavoriteArtworks_me$data
  relay: RelayPaginationProp
  onDataFetching?: (loading: boolean) => void
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

export class SavedWorks extends Component<Props, State> {
  state = {
    fetchingMoreData: false,
    refreshingFromPull: false,
  }

  componentDidMount = () => {
    RefreshEvents.addListener(FAVORITE_ARTWORKS_REFRESH_KEY, this.handleRefresh)
  }

  componentWillUnmount = () => {
    RefreshEvents.removeListener(FAVORITE_ARTWORKS_REFRESH_KEY, this.handleRefresh)
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
    this.props.relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx", error.message)
      }
      updateState(false)
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("SavedWorks/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const artworks = extractNodes(this.props.me?.followsAndSaves?.artworks)

    if (artworks.length === 0) {
      return (
        <StickyTabPageScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshingFromPull}
              onRefresh={this.handleRefresh}
            />
          }
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <ZeroState
            title="You haven’t saved any works yet"
            subtitle="Tap the heart on an artwork to save for later."
            callToAction={
              <Button
                size="large"
                onPress={() => {
                  navigate("/")
                }}
                block
              >
                Browse works for you
              </Button>
            }
          />
        </StickyTabPageScrollView>
      )
    }

    return (
      <ClassTheme>
        {({ space }) => (
          <StickyTabPageScrollView
            contentContainerStyle={{ paddingVertical: space(2) }}
            onEndReached={this.loadMore}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshingFromPull}
                onRefresh={this.handleRefresh}
              />
            }
          >
            <GenericGrid
              artworks={artworks}
              isLoading={this.state.fetchingMoreData}
              hidePartner
              artistNamesTextStyle={{ weight: "regular" }}
              saleInfoTextStyle={{
                weight: "medium",
                color: "black100",
              }}
            />
          </StickyTabPageScrollView>
        )}
      </ClassTheme>
    )
  }
}

const FavoriteArtworksContainer = createPaginationContainer(
  SavedWorks,
  {
    me: graphql`
      fragment FavoriteArtworks_me on Me
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
      ) {
        labFeatures
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
    getConnectionFromProps(props) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return props.me && props.me.followsAndSaves.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query FavoriteArtworksPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteArtworks_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteArtworksScreenQuery = graphql`
  query FavoriteArtworksQuery {
    me {
      ...FavoriteArtworks_me
    }
  }
`

export const FavoriteArtworksQueryRenderer = () => {
  const screen = useScreenDimensions()
  return (
    <QueryRenderer<FavoriteArtworksQuery>
      environment={defaultEnvironment}
      query={FavoriteArtworksScreenQuery}
      variables={{
        count: 10,
      }}
      render={renderWithPlaceholder({
        Container: FavoriteArtworksContainer,
        renderPlaceholder: () => {
          return (
            <StickyTabPageScrollView scrollEnabled={false} style={{ paddingTop: 20 }}>
              <GenericGridPlaceholder width={screen.width - 40} />
            </StickyTabPageScrollView>
          )
        },
        renderFallback: ({ retry }) => (
          <LoadFailureView onRetry={retry!} justifyContent="flex-end" />
        ),
      })}
    />
  )
}
