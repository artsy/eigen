import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import { get } from "lib/utils/get"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const artworks = get(partner, p => p.artworks)

  return (
    <StickyTabPageScrollView>
      {artworks ? (
        <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} />
      ) : (
        <TabEmptyState text="There is no artwork from this gallery yet" />
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
          # TODO: Just to satisfy relay-compiler
          edges {
            node {
              id
            }
          }
          ...InfiniteScrollArtworksGrid_connection
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
