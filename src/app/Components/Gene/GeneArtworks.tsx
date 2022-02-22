import { GeneArtworks_gene } from "__generated__/GeneArtworks_gene.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageFlatListContext } from "app/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { Schema } from "app/utils/track"
import { Box, Message, Text } from "palette"
import React, { useContext, useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { useArtworkFilters, useSelectedFiltersCount } from "../ArtworkFilter/useArtworkFilters"

interface GeneArtworksContainerProps {
  gene: GeneArtworks_gene
  relay: RelayPaginationProp
}

interface GeneArtworksProps extends GeneArtworksContainerProps {
  openFilterModal: () => void
}

export const GeneArtworks: React.FC<GeneArtworksProps> = ({ gene, relay, openFilterModal }) => {
  const tracking = useTracking()
  const artworksTotal = gene.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)
  const selectedFiltersCount = useSelectedFiltersCount()

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  useArtworkFilters({
    relay,
    aggregations: gene.artworks?.aggregations,
    componentPath: "Gene/GeneArtworks",
  })

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        <ArtworksFilterHeader
          selectedFiltersCount={selectedFiltersCount}
          onFilterPress={openFilterModal}
        />
      </Box>
    )
  }, [artworksTotal, openFilterModal])

  const trackClear = () => {
    tracking.trackEvent(tracks.clearFilters(gene.id, gene.slug))
  }

  if (initialArtworksTotal.current === 0) {
    return (
      <Box mt={1}>
        <Message>There aren’t any works available in the category at this time.</Message>
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
    <Box mt={1}>
      <Text variant="md" color="black60" mb={2}>
        Showing {artworksTotal} works
      </Text>
      <InfiniteScrollArtworksGrid
        connection={gene.artworks!}
        hasMore={relay.hasMore}
        loadMore={relay.loadMore}
      />
    </Box>
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
      <StickyTabPageScrollView disableScrollViewPanResponder>
        <GeneArtworks {...props} openFilterModal={openFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={gene.internalID}
          slug={gene.slug}
          visible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Gene}
        />
      </StickyTabPageScrollView>
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
    context_screen: Schema.ContextModules.ArtworkGrid,
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
