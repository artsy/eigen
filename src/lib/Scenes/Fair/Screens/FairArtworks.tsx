import { Theme } from "@artsy/palette"
import { FairArtworks_fair } from "__generated__/FairArtworks_fair.graphql"
import { FairArtworksQuery } from "__generated__/FairArtworksQuery.graphql"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props {
  fair: FairArtworks_fair
  fairID: string
  relay: RelayRefetchProp
}

interface State {
  filters: {
    medium: string
    priceRange: string
  }
}
@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairAllArtworksPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.gravityID,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairArtworks extends React.Component<Props, State> {
  handleRefetch = params => {
    const { gravityID: fairID } = this.props.fair
    this.props.relay.refetch({
      ...params,
      fairID,
    })
  }

  render() {
    const { fair } = this.props
    const { gravityID, internalID, artworks } = fair
    return (
      <Theme>
        <FilteredInfiniteScrollGrid
          id={gravityID}
          slug={internalID}
          type="Fair"
          filteredArtworks={artworks}
          onRefetch={this.handleRefetch}
        />
      </Theme>
    )
  }
}

export const FairArtworksContainer = createRefetchContainer(
  FairArtworks,
  {
    fair: graphql`
      fragment FairArtworks_fair on Fair
        @argumentDefinitions(
          medium: { type: "String", defaultValue: "*" }
          price_range: { type: "String", defaultValue: "*-*" }
        ) {
        id
        internalID
        gravityID
        artworks: filteredArtworks(
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
    query FairArtworksRefetchQuery($fairID: String!, $medium: String, $price_range: String) {
      fair(id: $fairID) {
        ...FairArtworks_fair @arguments(medium: $medium, price_range: $price_range)
      }
    }
  `
)

export const FairArtworksRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer<FairArtworksQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairArtworksQuery($fairID: String!) {
          fair(id: $fairID) {
            ...FairArtworks_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(FairArtworksContainer)}
    />
  )
}
