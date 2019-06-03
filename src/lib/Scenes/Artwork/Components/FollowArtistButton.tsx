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

interface State {
  isFollowedChanging: boolean
}

export class FollowArtistButton extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  handleFollowArtist = () => {
    const { artist, relay } = this.props

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<FollowArtistButtonMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: false,
            })
          },
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
    )
  }

  render() {
    const followButtonText = this.props.artist.is_followed ? "Following" : "Follow"
    return (
      <>
        <Sans color="black60" size="6" mx={1}>
          &middot;
        </Sans>
        <TouchableWithoutFeedback onPress={this.handleFollowArtist.bind(this)}>
          <Sans color="black60" size="4">
            {followButtonText}
          </Sans>
        </TouchableWithoutFeedback>
      </>
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
