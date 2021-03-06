import { FollowArtistButton_artist } from "__generated__/FollowArtistButton_artist.graphql"
import { FollowArtistButtonMutation } from "__generated__/FollowArtistButtonMutation.graphql"
import { Schema, track } from "lib/utils/track"
import { Sans, Touchable } from "palette"
import React from "react"
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
      action_name: props.artist.is_followed ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
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
      <Touchable onPress={() => this.handleFollowArtist()} haptic noFeedback>
        <Sans color="black60" weight="medium" size="3t" py="5px">
          {followButtonText}
        </Sans>
      </Touchable>
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
