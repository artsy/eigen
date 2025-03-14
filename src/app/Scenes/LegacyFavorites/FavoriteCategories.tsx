import { Flex, Spacer, Tabs } from "@artsy/palette-mobile"
import { FavoriteCategoriesQuery } from "__generated__/FavoriteCategoriesQuery.graphql"
import { FavoriteCategories_me$data } from "__generated__/FavoriteCategories_me.graphql"
import { SavedItemRow } from "app/Components/Lists/SavedItemRow"
import Spinner from "app/Components/Spinner"
import { ZeroState } from "app/Components/States/ZeroState"

import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"

import React from "react"
import { RefreshControl } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

interface Props {
  me: FavoriteCategories_me$data
  relay: RelayPaginationProp
}

interface State {
  fetchingMoreData: boolean
  refreshingFromPull: boolean
}

export class Categories extends React.Component<Props, State> {
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
        console.error("Categories/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  handleRefresh = () => {
    this.setState({ refreshingFromPull: true })
    this.props.relay.refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        // FIXME: Handle error
        console.error("Categories/index.tsx #handleRefresh", error.message)
      }
      this.setState({ refreshingFromPull: false })
    })
  }

  // @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
  render() {
    const rows = extractNodes(this.props.me.followsAndSaves?.genes)

    if (rows.length === 0) {
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
            title="You’re not following any categories yet"
            subtitle="Find a few categories to help improve your artwork recommendations."
          />
        </Tabs.ScrollView>
      )
    }

    return (
      <Tabs.FlatList
        style={{ paddingHorizontal: 0 }}
        contentContainerStyle={{ paddingVertical: 15 }}
        data={rows}
        ItemSeparatorComponent={() => <Spacer y={0.5} />}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
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
          return (
            <SavedItemRow
              square_image
              href={item.gene?.href!}
              image={item.gene?.image!}
              name={item.gene?.name!}
            />
          )
        }}
      />
    )
  }
}

const FavoriteCategoriesContainer = createPaginationContainer(
  Categories,
  {
    me: graphql`
      fragment FavoriteCategories_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followsAndSaves {
          genes: genesConnection(first: $count, after: $cursor)
            @connection(key: "Categories_followed_genes") {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                gene {
                  id
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
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.followsAndSaves?.genes
    },
    getVariables(_props, pageInfo, _fragmentVariables) {
      return pageInfo
    },
    query: graphql`
      query FavoriteCategoriesPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...FavoriteCategories_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FavoriteCategoriesQueryRenderer = () => {
  return (
    <QueryRenderer<FavoriteCategoriesQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query FavoriteCategoriesQuery {
          me {
            ...FavoriteCategories_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(FavoriteCategoriesContainer)}
    />
  )
}
