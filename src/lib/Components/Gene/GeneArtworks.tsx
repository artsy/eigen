import { GeneArtworks_gene } from "__generated__/GeneArtworks_gene.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader"
import { InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import Separator from "lib/Components/Separator"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { PAGE_SIZE } from "lib/data/constants"
import { Schema } from "lib/utils/track"
import { Box, Message } from "palette"
import React, { useContext, useState } from "react"
import { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface GeneArtworksContainerProps {
  gene: GeneArtworks_gene
  relay: RelayPaginationProp
}

interface GeneArtworksProps extends GeneArtworksContainerProps {
  openFilterModal: () => void
}

export const GeneArtworks: React.FC<GeneArtworksProps> = (props) => {
  const { gene, relay, openFilterModal } = props
  const tracking = useTracking()
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterParams = filterArtworksParams(appliedFilters, "geneArtwork")
  const artworksTotal = gene.artworks?.counts?.total ?? 0

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const trackClear = () => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
      context_screen_owner_id: gene.id,
      context_screen_owner_slug: gene.slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Gene/GeneArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (gene.artworks?.aggregations) {
      setAggregationsAction(gene.artworks.aggregations)
    }
  }, [])

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        <ArtworksFilterHeader count={artworksTotal} onFilterPress={openFilterModal} />
        <Separator />
      </Box>
    )
  }, [artworksTotal, openFilterModal])

  if (gene.artworks) {
    if (artworksTotal === 0) {
      return (
        <Box pt={1}>
          <FilteredArtworkGridZeroState id={gene.id} slug={gene.slug} trackClear={trackClear} />
        </Box>
      )
    }

    return (
      <Box mt={1}>
        <InfiniteScrollArtworksGrid
          connection={gene.artworks!}
          hasMore={props.relay.hasMore}
          loadMore={props.relay.loadMore}
        />
      </Box>
    )
  }

  return (
    <Box mt={1}>
      <Message>There aren’t any works available by the category at this time.</Message>
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
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
      context_screen: Schema.PageNames.GenePage,
      context_screen_owner_id: gene.id,
      context_screen_owner_slug: gene.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
      context_screen: Schema.PageNames.GenePage,
      context_screen_owner_id: gene.id,
      context_screen_owner_slug: gene.slug,
      action_type: Schema.ActionTypes.Tap,
    })
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
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
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
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
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
      query GeneArtworksPaginationQuery($id: ID!, $count: Int!, $cursor: String, $input: FilterArtworksInput) {
        node(id: $id) {
          ... on Gene {
            ...GeneArtworks_gene @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)
