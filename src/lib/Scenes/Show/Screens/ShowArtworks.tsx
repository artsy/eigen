import { Theme } from "@artsy/palette"
import { ShowArtworks_show } from "__generated__/ShowArtworks_show.graphql"
import { ShowArtworksQuery } from "__generated__/ShowArtworksQuery.graphql"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props {
  show: ShowArtworks_show
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
  context_screen_owner_slug: props.show.slug,
  context_screen_owner_id: props.show.internalID,
  owner_id: props.show.internalID,
  owner_slug: props.show.slug,
  owner_type: "Show",
}))
export class ShowArtworks extends React.Component<Props, State> {
  render() {
    return (
      <Theme>
        <FilteredInfiniteScrollGrid entity={this.props.show} />
      </Theme>
    )
  }
}

export const ShowArtworksContainer = createFragmentContainer(ShowArtworks, {
  show: graphql`
    fragment ShowArtworks_show on Show {
      id
      slug
      internalID
      ...FilteredInfiniteScrollGrid_entity
    }
  `,
})

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
