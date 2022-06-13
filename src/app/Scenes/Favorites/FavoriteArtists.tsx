import React from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"

import { FavoriteArtists_me$data } from "__generated__/FavoriteArtists_me.graphql"
import { FavoriteArtistsQuery } from "__generated__/FavoriteArtistsQuery.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { StickyTabPageFlatList } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ClassTheme, Spacer } from "palette"

interface Props {
  me: FavoriteArtists_me$data
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
    this.props.relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Artists/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const rows = extractNodes(this.props.me.followsAndSaves?.artists, (node) => node.artist!).map(
      (artist) => ({
        key: artist.id,
        content: (
          <ArtistListItem
            artist={artist}
            withFeedback
            containerStyle={{ paddingHorizontal: 20, paddingVertical: 5 }}
          />
        ),
      })
    )

    if (rows.length === 0) {
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
            title="You haven’t followed any artists yet"
            subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
          />
        </StickyTabPageScrollView>
      )
    }

    return (
      <ClassTheme>
        {({ space }) => (
          <StickyTabPageFlatList
            data={rows}
            onEndReached={this.loadMore}
            contentContainerStyle={{ paddingVertical: space(2) }}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshingFromPull}
                onRefresh={this.handleRefresh}
              />
            }
            style={{ paddingHorizontal: 0 }}
            ItemSeparatorComponent={() => <Spacer mb="10px" />}
            ListFooterComponent={
              this.state.fetchingMoreData ? (
                <Spinner style={{ marginTop: 20, marginBottom: 20 }} />
              ) : null
            }
          />
        )}
      </ClassTheme>
    )
  }
}

const FavoriteArtistsContainer = createPaginationContainer(
  Artists,
  {
    me: graphql`
      fragment FavoriteArtists_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        labFeatures
        followsAndSaves {
          artists: artistsConnection(first: $count, after: $cursor)
            @connection(key: "Artists_artists") {
            edges {
              node {
                artist {
                  id
                  ...ArtistListItem_artist
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.me.followsAndSaves?.artists
    },
    getVariables(_props, pageInfo, _fragmentVariables) {
      return pageInfo
    },
    query: graphql`
      query FavoriteArtistsPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteArtists_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteArtistsQueryRenderer = () => {
  return (
    <QueryRenderer<FavoriteArtistsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FavoriteArtistsQuery {
          me {
            ...FavoriteArtists_me
          }
        }
      `}
      variables={{ count: 10 }}
      render={renderWithLoadProgress(FavoriteArtistsContainer)}
    />
  )
}
