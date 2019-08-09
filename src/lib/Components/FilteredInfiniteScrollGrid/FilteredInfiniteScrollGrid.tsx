import { Box, Serif, Spacer } from "@artsy/palette"
import { FilteredInfiniteScrollGrid_entity } from "__generated__/FilteredInfiniteScrollGrid_entity.graphql"
import { PortalProvider } from "lib/Components/Portal"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { InfiniteScrollArtworksGridContainer } from "../ArtworkGrids/InfiniteScrollArtworksGrid"
import { FiltersContainer as Filters } from "./Filters"

interface Props {
  entity: FilteredInfiniteScrollGrid_entity
  relay: RelayPaginationProp
}

interface State {
  filters: {
    medium: string
    priceRange: string
  }
}

@track()
export class FilteredInfiniteScrollGrid extends React.Component<Props, State> {
  state: State = {
    filters: {
      medium: "",
      priceRange: "",
    },
  }

  @track(eventProps(Schema.ActionNames.FilterMedium))
  trackMediumChange() {
    return null
  }

  @track(eventProps(Schema.ActionNames.FilterPrice))
  trackPriceRangeChange() {
    return null
  }

  handleFilterChange = filter => selected => {
    if (filter === "medium") {
      this.trackMediumChange()
    } else if (filter === "priceRange") {
      this.trackPriceRangeChange()
    }

    this.setState(
      {
        filters: {
          ...this.state.filters,
          [filter]: selected.value,
        },
      },
      () => {
        this.refetch()
      }
    )
  }

  refetch = () => {
    const {
      filters: { medium, priceRange },
    } = this.state
    this.props.relay.refetchConnection(10, undefined, {
      medium,
      priceRange,
    })
  }

  render() {
    const { filterArtworksConnection } = this.props.entity
    const {
      filters: { priceRange, medium },
    } = this.state
    return (
      <PortalProvider>
        <Box pt={3}>
          <InfiniteScrollArtworksGridContainer
            connection={filterArtworksConnection}
            loadMore={this.props.relay.loadMore}
            shouldAddPadding={true}
            HeaderComponent={
              <Box px={2}>
                <Spacer m={2} />
                <Serif size="8">Works</Serif>
                <Filters
                  filteredArtworks={filterArtworksConnection}
                  priceRangeValue={priceRange}
                  mediumValue={medium}
                  onFilterChange={this.handleFilterChange}
                />
              </Box>
            }
          />
        </Box>
      </PortalProvider>
    )
  }
}

function eventProps(actionName: Schema.ActionNames) {
  return {
    action_name: actionName,
    action_type: Schema.ActionTypes.Tap,
  }
}

export const FilteredInfiniteScrollGridContainer = createPaginationContainer(
  FilteredInfiniteScrollGrid,
  {
    entity: graphql`
      fragment FilteredInfiniteScrollGrid_entity on EntityWithFilterArtworksConnectionInterface
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String" }
          medium: { type: "String", defaultValue: "*" }
          priceRange: { type: "String", defaultValue: "*-*" }
        ) {
        id
        filterArtworksConnection(
          first: $count
          after: $cursor
          medium: $medium
          priceRange: $priceRange
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
        ) @connection(key: "FilteredInfiniteScrollGridContainer_filterArtworksConnection") {
          # TODO: Only to satisfy the relay compiler
          edges {
            node {
              id
            }
          }
          ...Filters_filteredArtworks
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.entity.filterArtworksConnection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.entity.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query FilteredInfiniteScrollGridQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $medium: String
        $priceRange: String
      ) {
        node(id: $id) {
          ... on EntityWithFilterArtworksConnectionInterface {
            ...FilteredInfiniteScrollGrid_entity
              @arguments(count: $count, cursor: $cursor, medium: $medium, priceRange: $priceRange)
          }
        }
      }
    `,
  }
)
