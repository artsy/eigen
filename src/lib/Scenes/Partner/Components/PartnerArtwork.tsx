import { Box, Flex } from "@artsy/palette"
import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Spinner from "lib/Components/Spinner"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import { get } from "lib/utils/get"
import React, { useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 6

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)

  const artworks = get(partner, p => p.artworks)

  if (!artworks) {
    return (
      <StickyTabPageScrollView>
        <TabEmptyState text="There is no artwork from this gallery yet" />
      </StickyTabPageScrollView>
    )
  }

  return (
    // TODO: switch to StickyTabPageFlatList
    <StickyTabPageScrollView
      onEndReachedThreshold={0}
      onEndReached={() => {
        if (fetchingNextPage || !relay.hasMore()) {
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
      }}
    >
      {artworks && <GenericGrid artworks={artworks.edges.map(({ node }) => node)} />}
      {fetchingNextPage && (
        <Box p={2} style={{ height: 50 }}>
          <Flex style={{ flex: 1 }} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        </Box>
      )}
    </StickyTabPageScrollView>
  )
}

export const PartnerArtworkFragmentContainer = createPaginationContainer(
  PartnerArtwork,
  {
    partner: graphql`
      fragment PartnerArtwork_partner on Partner
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 6 }
          cursor: { type: "String" }
          sort: { type: "ArtworkSorts", defaultValue: PARTNER_UPDATED_AT_DESC }
        ) {
        internalID
        artworks: artworksConnection(sort: $sort, first: $count, after: $cursor) @connection(key: "Partner_artworks") {
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
