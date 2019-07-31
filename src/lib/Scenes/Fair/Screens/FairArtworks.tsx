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
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
}))
export class FairArtworks extends React.Component<Props, State> {
  handleRefetch = params => {
    const { internalID: fairID } = this.props.fair
    this.props.relay.refetch({
      ...params,
      fairID,
    })
  }

  render() {
    const { fair } = this.props
    const { slug, internalID, artworks } = fair
    return (
      <Theme>
        <FilteredInfiniteScrollGrid
          id={internalID}
          slug={slug}
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
          priceRange: { type: "String", defaultValue: "*-*" }
        ) {
        id
        internalID
        slug
        artworks: filteredArtworks(
          size: 0
          medium: $medium
          priceRange: $priceRange
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
        ...FairArtworks_fair @arguments(medium: $medium, priceRange: $price_range)
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
