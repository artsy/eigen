import { Sans } from "@artsy/palette"
import { FollowArtistButton_artist } from "__generated__/FollowArtistButton_artist.graphql"
import { FollowArtistButtonMutation } from "__generated__/FollowArtistButtonMutation.graphql"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: FollowArtistButton_artist
  relay: RelayProp
  contextModule?: string
}

@track()
export class FollowArtistButton extends React.Component<Props> {
  @track((props: Props) => {
    return {
      action_name: props.artist.is_followed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
      action_type: Schema.ActionTypes.Success,
      owner_id: props.artist.internalID,
      owner_slug: props.artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
      context_module: props.contextModule ? props.contextModule : null,
    } as any
  })
  handleFollowArtist() {
    const { artist, relay } = this.props
    commitMutation<FollowArtistButtonMutation>(relay.environment, {
      mutation: graphql`
        mutation FollowArtistButtonMutation($input: FollowArtistInput!) {
          followArtist(input: $input) {
            artist {
              id
              is_followed: isFollowed
            }
          }
        }
      `,
      variables: {
        input: {
          // FIXME: Should this be slug or internalID?
          artistID: artist.slug,
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
      <TouchableWithoutFeedback onPress={() => this.handleFollowArtist()}>
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
      id
      slug
      internalID
      is_followed: isFollowed
    }
  `,
})
