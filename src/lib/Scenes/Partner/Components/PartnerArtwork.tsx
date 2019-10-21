import { Box } from "@artsy/palette"
import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { get } from "lib/utils/get"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 6

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const artworks = get(partner, p => p.artworks)

  const fetchNextPage = () => {
    if (fetchingNextPage) {
      return
    }
    setFetchingNextPage(true)
    relay.loadMore(PAGE_SIZE, error => {
      if (error) {
        // FIXME: Handle error
        console.error("PartnerArtwork.tsx", error.message)
      }
      setFetchingNextPage(false)
    })
  }

  return (
    <ScrollView onScroll={isCloseToBottom(fetchNextPage)}>
      <Box px={2} py={3}>
        {artworks && <GenericGrid artworks={artworks.edges.map(({ node }) => node)} />}
      </Box>
    </ScrollView>
  )
}

export const PartnerArtworkFragmentContainer = createPaginationContainer(
  PartnerArtwork,
  {
    partner: graphql`
      fragment PartnerArtwork_partner on Partner
        @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        internalID
        artworks: artworksConnection(first: $count, after: $cursor) @connection(key: "Partner_artworks") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              ...GenericGrid_artworks
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.partner && props.partner.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerArtworkInfiniteScrollGridQuery($id: String!, $cursor: String, $count: Int!) {
        partner(id: $id) {
          ...PartnerArtwork_partner @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
