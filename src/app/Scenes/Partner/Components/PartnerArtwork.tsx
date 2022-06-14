import { PartnerArtwork_partner$data } from "__generated__/PartnerArtwork_partner.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { get } from "app/utils/get"
import { Spacer } from "palette"
import React, { useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  useArtworkFilters({
    relay,
    aggregations: partner.artworks?.aggregations,
    componentPath: "PartnerArtwork/PartnerArtwork",
    pageSize: 30,
  })

  const [isFilterArtworksModalVisible, setIsFilterArtworksModalVisible] = useState(false)

  const artworks = get(partner, (p) => p.artworks)

  return (
    <>
      <StickyTabPageScrollView>
        <Spacer mb={2} />

        {artworks ? (
          <InfiniteScrollArtworksGrid
            connection={artworks}
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
          />
        ) : (
          <TabEmptyState text="There is no artwork from this gallery yet" />
        )}
      </StickyTabPageScrollView>

      <AnimatedArtworkFilterButton
        isVisible
        onPress={() => {
          setIsFilterArtworksModalVisible(true)
        }}
      />

      <ArtworkFilterNavigator
        visible={isFilterArtworksModalVisible}
        id={partner.internalID}
        slug={partner.slug}
        mode={FilterModalMode.Partner}
        exitModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
        closeModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
      />
    </>
  )
}

export const PartnerArtworkFragmentContainer = createPaginationContainer(
  PartnerArtwork,
  {
    partner: graphql`
      fragment PartnerArtwork_partner on Partner
      @argumentDefinitions(
        # 10 matches the PAGE_SIZE constant. This is required. See MX-316 for follow-up.
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            COLOR
            DIMENSION_RANGE
            ARTIST
            MAJOR_PERIOD
            MEDIUM
            PRICE_RANGE
            MATERIALS_TERMS
            ARTIST_NATIONALITY
          ]
          input: $input
        ) @connection(key: "Partner_artworks") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
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
    getConnectionFromProps(props) {
      return props.partner && props.partner.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerArtworkInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        partner(id: $id) {
          ...PartnerArtwork_partner @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
