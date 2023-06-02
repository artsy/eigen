import { Box, Text, SimpleMessage, Tabs } from "@artsy/palette-mobile"
import { GeneArtworks_gene$data } from "__generated__/GeneArtworks_gene.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { GeneArtworksFilterHeader } from "app/Components/Gene/GeneArtworksFilterHeader"

import { Schema } from "app/utils/track"
import React, { useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface GeneArtworksContainerProps {
  gene: GeneArtworks_gene$data
  relay: RelayPaginationProp
}

export const GeneArtworks: React.FC<GeneArtworksContainerProps> = ({ gene, relay }) => {
  const tracking = useTracking()
  const artworksTotal = gene.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)

  useArtworkFilters({
    relay,
    aggregations: gene.artworks?.aggregations,
    componentPath: "Gene/GeneArtworks",
  })

  const trackClear = () => {
    tracking.trackEvent(tracks.clearFilters(gene.id, gene.slug))
  }

  if (initialArtworksTotal.current === 0) {
    return (
      <Box mt={1}>
        <SimpleMessage>
          There aren’t any works available in the category at this time.
        </SimpleMessage>
      </Box>
    )
  }

  if (artworksTotal === 0) {
    return (
      <Box pt={1}>
        <FilteredArtworkGridZeroState id={gene.id} slug={gene.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <>
      <Box mt={1}>
        <Text variant="sm-display" color="black60" mb={2}>
          Showing {artworksTotal} works
        </Text>
        <InfiniteScrollArtworksGrid
          connection={gene.artworks!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
        />
      </Box>
    </>
  )
}

const GeneArtworksContainer: React.FC<GeneArtworksContainerProps> = (props) => {
  const { gene } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    tracking.trackEvent(tracks.openFilterWindow(gene.id, gene.slug))
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilterWindow(gene.id, gene.slug))
    handleCloseFilterArtworksModal()
  }

  return (
    <ArtworkFiltersStoreProvider>
      <Tabs.ScrollView disableScrollViewPanResponder>
        <Tabs.SubTabBar>
          <GeneArtworksFilterHeader openFilterArtworksModal={openFilterArtworksModal} />
        </Tabs.SubTabBar>
        <GeneArtworks {...props} />
        <ArtworkFilterNavigator
          {...props}
          id={gene.internalID}
          slug={gene.slug}
          visible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Gene}
        />
      </Tabs.ScrollView>
    </ArtworkFiltersStoreProvider>
  )
}

export const GeneArtworksPaginationContainer = createPaginationContainer(
  GeneArtworksContainer,
  {
    gene: graphql`
      fragment GeneArtworks_gene on Gene
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            LOCATION_CITY
            ARTIST_NATIONALITY
            PRICE_RANGE
            COLOR
            DIMENSION_RANGE
            PARTNER
            MAJOR_PERIOD
            MEDIUM
            PRICE_RANGE
            ARTIST
            LOCATION_CITY
            MATERIALS_TERMS
          ]
          forSale: true
          input: $input
        ) @connection(key: "GeneArtworksGrid_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
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
      return props.gene.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.gene.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query GeneArtworksPaginationQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        node(id: $id) {
          ... on Gene {
            ...GeneArtworks_gene @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)

export const tracks = {
  clearFilters: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openFilterWindow: (id: string, slug: string) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterWindow: (id: string, slug: string) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
