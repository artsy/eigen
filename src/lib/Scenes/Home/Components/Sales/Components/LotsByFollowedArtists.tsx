import React, { Component } from "react"
import { ScrollView } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { LotsByFollowedArtists_query } from "__generated__/LotsByFollowedArtists_query.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Spinner from "lib/Components/Spinner"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { SectionHeader } from "./SectionHeader"

const DEFAULT_TITLE = "Lots by Artists You Follow"

interface Props {
  relay: RelayPaginationProp
  title?: string
  query: LotsByFollowedArtists_query
}

interface State {
  fetchingMoreData: boolean
}

export class LotsByFollowedArtists extends Component<Props, State> {
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
        console.error("LotsByFollowedArtists.tsx", error.message)
      }
      this.setState({ fetchingMoreData: false })
    })
  }

  render() {
    const artworks = this.props.query.sale_artworks.edges.map(edge => edge.node.artwork)
    if (artworks.length === 0) {
      return null
    }

    const { title = DEFAULT_TITLE } = this.props

    return (
      <ScrollView onScroll={isCloseToBottom(this.loadMore)} scrollEventThrottle={400}>
        <SectionHeader title={title} />
        <Container>
          <GenericGrid artworks={artworks as any} />
          {this.state.fetchingMoreData && <Spinner style={{ marginTop: 20 }} />}
        </Container>
      </ScrollView>
    )
  }
}

export default createPaginationContainer(
  LotsByFollowedArtists,
  {
    query: graphql`
      fragment LotsByFollowedArtists_query on Query
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        sale_artworks: saleArtworksConnection(
          first: $count
          after: $cursor
          liveSale: true
          isAuction: true
          includeArtworksByFollowedArtists: true
        ) @connection(key: "LotsByFollowedArtists_sale_artworks") {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            cursor
            node {
              artwork {
                ...GenericGrid_artworks
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ query }) => query && query.sale_artworks,
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql`
      query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
        ...LotsByFollowedArtists_query @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
)

const Container = styled.View`
  padding: 10px;
`
