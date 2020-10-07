import { Fair2AllFollowedArtists_fair } from "__generated__/Fair2AllFollowedArtists_fair.graphql"
import { Fair2AllFollowedArtistsQuery } from "__generated__/Fair2AllFollowedArtistsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair2ArtworksFragmentContainer } from "./Components/Fair2Artworks"

interface Fair2AllFollowedArtistsProps {
  fair: Fair2AllFollowedArtists_fair
}

export const Fair2AllFollowedArtists: React.FC<Fair2AllFollowedArtistsProps> = ({ fair }) => {
  return <Fair2ArtworksFragmentContainer fair={fair} />
}

export const Fair2AllFollowedArtistsFragmentContainer = createFragmentContainer(Fair2AllFollowedArtists, {
  fair: graphql`
    fragment Fair2AllFollowedArtists_fair on Fair {
      ...Fair2Artworks_fair @arguments(includeArtworksByFollowedArtists: true)
    }
  `,
})

export const Fair2AllFollowedArtistsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2AllFollowedArtistsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2AllFollowedArtistsQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2AllFollowedArtists_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(Fair2AllFollowedArtistsFragmentContainer)}
    />
  )
}
