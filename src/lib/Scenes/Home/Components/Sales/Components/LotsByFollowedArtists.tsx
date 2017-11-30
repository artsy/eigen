import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React, { Component } from "react"
import createEnvironment from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import styled from "styled-components/native"
import { Button, ScrollView, Text, View } from "react-native"
import { RelayPaginationProp } from "react-relay"
import { SectionHeader } from "./SectionHeader"
import { createPaginationContainer, graphql, QueryRenderer, QueryRendererProps } from "react-relay"
import { get } from "lodash"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { once } from "lodash"

const PAGE_SIZE = 8 // FIXME: Increase default return in Metaphysics

interface RelayProps {
  relay: RelayPaginationProp
  viewer: {
    sale_artworks: {
      connection: {
        pageInfo: {
          hasNextPage: boolean
        }
        edges: Array<{
          node: {
            is_biddable: boolean
            artwork: {
              image: {
                aspect_ratio: number
              }
            }
          }
        }>
      }
    }
  }
}

const Container = styled.View`padding: 10px;`

const Query = graphql.experimental`
  query LotsByFollowedArtistsQuery($count: Int!, $cursor: String) {
    viewer {
      ...LotsByFollowedArtists_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`

const Pagination = createPaginationContainer(
  GridContainer,
  graphql.experimental`
    fragment LotsByFollowedArtists_viewer on Viewer
      @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" }) {
      sale_artworks(first: $count, after: $cursor, include_artworks_by_followed_artists: false)
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
    getConnectionFromProps: ({ viewer }) => viewer && viewer.sale_artworks,
    getFragmentVariables: (prevVars, totalCount) => ({ ...prevVars, count: totalCount }),
    getVariables: (props, { count, cursor }) => ({ count, cursor }),
    query: Query,
  }
)

export class LotsByFollowedArtists extends Component<any> {
  render() {
    return (
      <QueryRenderer
        environment={createEnvironment()}
        query={Query}
        variables={{
          count: PAGE_SIZE,
        }}
        render={renderWithLoadProgress(Pagination)}
      />
    )
  }
}

function GridContainer(props: RelayProps) {
  const { relay, viewer } = props

  const artworks = get(viewer, "sale_artworks.edges", [])
    .filter(({ node }) => !node.is_biddable)
    .map(({ node }) => node.artwork)

  if (!artworks.length) {
    return null
  }

  const loadMore =
    relay.hasMore() &&
    once(() => {
      relay.loadMore(PAGE_SIZE, x => x)
    })

  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      loadMore()
    }
  }

  return (
    <ScrollView onScroll={handleScroll} scrollEventThrottle={30}>
      <SectionHeader title="Lots by Artists You Follow" />
      <Container>
        <GenericGrid artworks={artworks} />
      </Container>
    </ScrollView>
  )
}
