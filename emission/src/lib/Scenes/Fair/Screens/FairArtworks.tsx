import { Theme } from "@artsy/palette"
import { FairArtworks_fair } from "__generated__/FairArtworks_fair.graphql"
import { FairArtworksQuery } from "__generated__/FairArtworksQuery.graphql"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props {
  fair: FairArtworks_fair
  fairID: string
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairAllArtworksPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.slug,
  context_screen_owner_id: props.fair.internalID,
  owner_id: props.fair.internalID,
  owner_slug: props.fair.slug,
  owner_type: "Fair",
}))
export class FairArtworks extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <FilteredInfiniteScrollGrid entity={this.props.fair} />
      </Theme>
    )
  }
}

export const FairArtworksContainer = createFragmentContainer(FairArtworks, {
  fair: graphql`
    fragment FairArtworks_fair on Fair
      @argumentDefinitions(
        medium: { type: "String", defaultValue: "*" }
        priceRange: { type: "String", defaultValue: "*-*" }
      ) {
      id
      internalID
      slug
      ...FilteredInfiniteScrollGrid_entity
    }
  `,
})

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
