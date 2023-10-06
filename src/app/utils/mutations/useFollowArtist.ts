import { graphql, useMutation } from "react-relay"

export const useFollowArtist = () => {
  return useMutation(graphql`
    mutation useFollowArtistMutation($input: FollowArtistInput!) {
      followArtist(input: $input) {
        artist {
          ...RelatedArtistsRailCell_relatedArtist
        }
      }
    }
  `)
}
