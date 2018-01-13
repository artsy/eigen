import React, { Component } from "react"
import { ScrollView } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { once } from "lodash"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Spinner from "lib/Components/Spinner"
import { PAGE_SIZE } from "lib/data/constants"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { SectionHeader } from "./SectionHeader"

const DEFAULT_TITLE = "Lots by Artists You Follow"

export class LotsByFollowedArtists extends Component<Props> {
  state = {
    artworks: [],
  }

  componentWillMount() {
    this.setState({
      artworks: this.artworks,
    })
  }

  componentDidUpdate() {
    const { artworks } = this

    if (artworks.length > 0 && artworks.length !== this.state.artworks.length) {
      this.setState({
        artworks: this.artworks,
      })
    }
  }

  get artworks() {
    const { viewer } = this.props

    const artworks =
      (viewer.sale_artworks &&
        viewer.sale_artworks.edges
          .filter(({ node }) => node.sale && node.sale.is_open)
          .map(({ node }) => node.artwork)) ||
      []

    return artworks
  }

  render() {
    const { relay, title = DEFAULT_TITLE } = this.props
    const showSpinner = relay.hasMore() && relay.isLoading()

    const loadMore =
      relay.hasMore() &&
      once(() => {
        relay.loadMore(PAGE_SIZE, x => x)
      })

    return (
      <ScrollView onScroll={isCloseToBottom(loadMore)} scrollEventThrottle={400}>
        <SectionHeader title={title} />
        <Container>
          <GenericGrid artworks={this.state.artworks} />
          {showSpinner && <Spinner style={{ marginTop: 20 }} />}
        </Container>
      </ScrollView>
    )
  }
}

export default createPaginationContainer(
  LotsByFollowedArtists,
  graphql.experimental`
    fragment LotsByFollowedArtists_viewer on Viewer
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
      sale_artworks: sale_artworks(first: $count, after: $cursor, include_artworks_by_followed_artists: true)
        @connection(key: "LotsByFollowedArtists_sale_artworks") {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          cursor
          node {
            sale {
              is_open
            }
            artwork {
              ...GenericGrid_artworks
            }
          }
        }
      }
    }
  `,
  {
    getConnectionFromProps: ({ viewer }) => viewer && (viewer.sale_artworks as ConnectionData),
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql.experimental`
      query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
        viewer {
          ...LotsByFollowedArtists_viewer @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

const Container = styled.View`
  padding: 10px;
`

interface Props {
  relay?: RelayPaginationProp
  title?: string
  viewer?: {
    sale_artworks: {
      edges: Array<{
        node: {
          artwork: object | null
          sale: {
            is_open: boolean | null
          } | null
        }
      }> | null
    } | null
  }
}
