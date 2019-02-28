import { Box, Serif, Spacer } from "@artsy/palette"
import { PortalProvider } from "lib/Components/Portal"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworksGridPaginationContainer } from "./ArtworksGridPaginationContainer"
import { FiltersContainer as Filters } from "./Filters"

interface Props {
  onRefetch: (params: object) => any
  filteredArtworks: any
  slug?: string
  id?: string
  type?: string
}

interface State {
  filters: {
    medium: string
    priceRange: string
  }
}

@track()
export class FilteredInfiniteScrollGrid extends React.Component<Props, State> {
  state = {
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
    this.props.onRefetch({
      medium,
      price_range: priceRange,
    })
  }

  render() {
    const { filteredArtworks } = this.props
    const {
      filters: { priceRange, medium },
    } = this.state
    return (
      <PortalProvider>
        <Box pt={3}>
          <ArtworksGridPaginationContainer
            filteredArtworks={filteredArtworks}
            shouldAddPadding={true}
            mapPropsToArtworksConnection={props => props.filteredArtworks.artworks}
            HeaderComponent={
              <Box px={2}>
                <Spacer m={2} />
                <Serif size="8">Works</Serif>
                <Filters
                  filteredArtworks={filteredArtworks}
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
  return props => ({
    action_name: actionName,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.id,
    owner_slug: props.slug,
    owner_type: props.type,
  })
}

export const FilteredInfiniteScrollGridContainer = createFragmentContainer(
  FilteredInfiniteScrollGrid,
  graphql`
    fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
      ...Filters_filteredArtworks
      ...ArtworksGridPaginationContainer_filteredArtworks
    }
  `
)
