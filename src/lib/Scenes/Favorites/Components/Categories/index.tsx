import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import Spinner from "lib/Components/Spinner"
import ZeroState from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"

interface State {
  fetchingMoreData: boolean
}

export class Categories extends React.Component<RelayProps, State> {
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
        console.error("Artists/index.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  render() {
    const rows: any[] = this.props.me.followed_genes.edges.map(edge => edge.node.gene)

    if (rows.length === 0) {
      return (
        <ZeroState
          title="You’re not following any categories yet"
          subtitle="Find a few categories to help improve your artwork recommendations."
        />
      )
    }

    return (
      <FlatList
        data={rows}
        keyExtractor={({ __id }) => __id}
        renderItem={data => <SavedItemRow square_image {...data.item} />}
        onEndReached={this.loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          this.state.fetchingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null
        }
      />
    )
  }
}

export default createPaginationContainer<RelayProps>(
  Categories,
  {
    me: graphql.experimental`
      fragment Categories_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        followed_genes(first: $count, after: $cursor) @connection(key: "Categories_followed_genes") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              gene {
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
      return props.me && props.me.followed_genes
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
      query CategoriesMeQuery($count: Int!, $cursor: String) {
        me {
          ...Categories_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

interface RelayProps {
  relay?: RelayPaginationProp
  me: {
    followed_genes: {
      edges: any[] | null
    } | null
  } | null
}
