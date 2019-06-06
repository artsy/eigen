import { Theme } from "@artsy/palette"
import { ShowArtworks_show } from "__generated__/ShowArtworks_show.graphql"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props {
  show: ShowArtworks_show
  relay: RelayRefetchProp
}

interface State {
  filters: {
    medium: string
    priceRange: string
  }
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.ShowAllArtists,
  context_screen_owner_type: Schema.OwnerEntityTypes.Show,
  context_screen_owner_slug: props.show.gravityID,
  context_screen_owner_id: props.show.internalID,
}))
export class ShowArtworks extends React.Component<Props, State> {
  handleRefetch = params => {
    this.props.relay.refetch({
      ...params,
    })
  }

  render() {
    const { show } = this.props
    return (
      <Theme>
        <FilteredInfiniteScrollGrid
          id={show.internalID}
          slug={show.gravityID}
          type={"Show"}
          filteredArtworks={show.filteredArtworks}
          onRefetch={this.handleRefetch}
        />
      </Theme>
    )
  }
}

export const ShowArtworksContainer = createRefetchContainer(
  ShowArtworks,
  {
    show: graphql`
      fragment ShowArtworks_show on Show
        @argumentDefinitions(
          medium: { type: "String", defaultValue: "*" }
          price_range: { type: "String", defaultValue: "*-*" }
        ) {
        id
        gravityID
        internalID
        filteredArtworks(
          size: 0
          medium: $medium
          price_range: $price_range
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
        ) {
          ...FilteredInfiniteScrollGrid_filteredArtworks
        }
      }
    `,
  },
  graphql`
    query ShowArtworksRefetchQuery($showID: String!, $medium: String, $price_range: String) {
      show(id: $showID) {
        ...ShowArtworks_show @arguments(medium: $medium, price_range: $price_range)
      }
    }
  `
)

export const ShowArtworksRenderer: React.SFC<{ showID: string }> = ({ showID }) => {
  return (
    <QueryRenderer<ShowArtworksQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ShowArtworksQuery($showID: String!) {
          show(id: $showID) {
            ...ShowArtworks_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithLoadProgress(ShowArtworksContainer)}
    />
  )
}
