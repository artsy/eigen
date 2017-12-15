import React from "react"
import { ScrollView } from "react-native"
import { ConnectionData, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"

import { once } from "lodash"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Spinner from "lib/Components/Spinner"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { SectionHeader } from "./SectionHeader"

const DEFAULT_TITLE = "Lots by Artists You Follow"
const PAGE_SIZE = 10

export const LotsByFollowedArtists: React.SFC<Props> = props => {
  const { viewer, relay, title = DEFAULT_TITLE } = props
  const artworks = viewer.sale_artworks.edges.filter(({ node }) => node.is_biddable).map(({ node }) => node.artwork)

  if (!artworks.length) {
    return null
  }

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
        <GenericGrid artworks={artworks} />
        {showSpinner && <Spinner style={{ marginTop: 20 }} />}
      </Container>
    </ScrollView>
  )
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
            is_biddable
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
          is_biddable: boolean | null
        }
      }> | null
    } | null
  }
}
