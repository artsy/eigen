import { PartnerArtwork_partner } from "__generated__/PartnerArtwork_partner.graphql"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { TabEmptyState } from "lib/Components/TabEmptyState"
import { useArtworkFilters } from "lib/utils/ArtworkFilter/useArtworkFilters"
import { get } from "lib/utils/get"
import { Spacer } from "palette"
import React, { useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  useArtworkFilters({ relay, aggregations: partner.artworks?.aggregations })

  const [isFilterArtworksModalVisible, setIsFilterArtworksModalVisible] = useState(false)

  const artworks = get(partner, (p) => p.artworks)

  return (
    <>
      <StickyTabPageScrollView>
        <Spacer mb="2" />

        {artworks ? (
          <InfiniteScrollArtworksGrid connection={artworks} loadMore={relay.loadMore} hasMore={relay.hasMore} />
        ) : (
          <TabEmptyState text="There is no artwork from this gallery yet" />
        )}
      </StickyTabPageScrollView>

      <AnimatedArtworkFilterButton
        isVisible={true}
        onPress={() => {
          setIsFilterArtworksModalVisible(true)
        }}
      />

      <FilterModalNavigator
        isFilterArtworksModalVisible={isFilterArtworksModalVisible}
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
        acquireable: { type: "Boolean" }
        attributionClass: { type: "[String]" }
        color: { type: "String" }
        # 10 matches the PAGE_SIZE constant. This is required. See MX-316 for follow-up.
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        dimensionRange: { type: "String", defaultValue: "*-*" }
        inquireableOnly: { type: "Boolean" }
        majorPeriods: { type: "[String]" }
        medium: { type: "String", defaultValue: "*" }
        offerable: { type: "Boolean" }
        priceRange: { type: "String" }
        sort: { type: "String", defaultValue: "-partner_updated_at" }
      ) {
        internalID
        slug
        artworks: filterArtworksConnection(
          acquireable: $acquireable
          after: $cursor
          aggregations: [COLOR, DIMENSION_RANGE, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]
          attributionClass: $attributionClass
          color: $color
          dimensionRange: $dimensionRange
          first: $count
          inquireableOnly: $inquireableOnly
          majorPeriods: $majorPeriods
          medium: $medium
          offerable: $offerable
          priceRange: $priceRange
          sort: $sort
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
        ...fragmentVariables,
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerArtworkInfiniteScrollGridQuery(
        $acquireable: Boolean
        $attributionClass: [String]
        $color: String
        $count: Int!
        $cursor: String
        $dimensionRange: String
        $id: String!
        $inquireableOnly: Boolean
        $majorPeriods: [String]
        $medium: String
        $offerable: Boolean
        $priceRange: String
        $sort: String
      ) {
        partner(id: $id) {
          ...PartnerArtwork_partner
            @arguments(
              acquireable: $acquireable
              attributionClass: $attributionClass
              color: $color
              count: $count
              cursor: $cursor
              dimensionRange: $dimensionRange
              inquireableOnly: $inquireableOnly
              majorPeriods: $majorPeriods
              medium: $medium
              offerable: $offerable
              priceRange: $priceRange
              sort: $sort
            )
        }
      }
    `,
  }
)
