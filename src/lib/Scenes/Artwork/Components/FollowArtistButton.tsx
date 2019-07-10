import { Sans } from "@artsy/palette"
import { FollowArtistButton_artist } from "__generated__/FollowArtistButton_artist.graphql"
import { FollowArtistButtonMutation } from "__generated__/FollowArtistButtonMutation.graphql"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: FollowArtistButton_artist
  relay: RelayProp
}

export class FollowArtistButton extends React.Component<Props> {
  handleFollowArtist = () => {
    const { artist, relay } = this.props
    commitMutation<FollowArtistButtonMutation>(relay.environment, {
      mutation: graphql`
        mutation FollowArtistButtonMutation($input: FollowArtistInput!) {
          followArtist(input: $input) {
            artist {
              id
              is_followed
            }
          }
        }
      `,
      variables: {
        input: {
          artist_id: artist.gravityID,
          unfollow: artist.is_followed,
        },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artist.id,
            is_followed: !artist.is_followed,
          },
        },
      },
    })
  }

  render() {
    const followButtonText = this.props.artist.is_followed ? "Following" : "Follow"
    return (
      <TouchableWithoutFeedback onPress={this.handleFollowArtist.bind(this)}>
        <Sans color="black60" weight="medium" size="3t">
          {followButtonText}
        </Sans>
      </TouchableWithoutFeedback>
    )
  }
}

export const FollowArtistButtonFragmentContainer = createFragmentContainer(FollowArtistButton, {
  artist: graphql`
    fragment FollowArtistButton_artist on Artist {
      gravityID
      id
      is_followed
    }
  `,
})
