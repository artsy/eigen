import { useFollowArtistMutation } from "__generated__/useFollowArtistMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useFollowArtist = () => {
  return useMutation<useFollowArtistMutation>(graphql`
    mutation useFollowArtistMutation($input: FollowArtistInput!) {
      followArtist(input: $input) {
        artist {
          ...ArtistFollowButton_artist
          ...RelatedArtistsRailCell_relatedArtist
        }
      }
    }
  `)
}
