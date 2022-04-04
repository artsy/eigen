import { FollowArtistLink_artist } from "__generated__/FollowArtistLink_artist.graphql"
import { FollowArtistLinkMutation } from "__generated__/FollowArtistLinkMutation.graphql"
import { Schema, track } from "app/utils/track"
import { Sans, Touchable } from "palette"
import React from "react"
import { injectIntl, IntlShape } from "react-intl"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: FollowArtistLink_artist
  relay: RelayProp
  contextModule?: string
  intl: IntlShape
}

@track()
export class FollowArtistLink extends React.Component<Props> {
  @track((props: Props) => {
    return {
      action_name: props.artist.is_followed
        ? Schema.ActionNames.ArtistUnfollow
        : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Success,
      owner_id: props.artist.internalID,
      owner_slug: props.artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
      context_module: props.contextModule ? props.contextModule : null,
    } as any
  })
  handleFollowArtist() {
    const { artist, relay } = this.props
    commitMutation<FollowArtistLinkMutation>(relay.environment, {
      mutation: graphql`
        mutation FollowArtistLinkMutation($input: FollowArtistInput!) {
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
      // @ts-ignore RELAY 12 MIGRATION
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
    const followingText = this.props.intl.formatMessage({
      id: "scene.artwork.components.followArtistLink.followButtonText.following",
      defaultMessage: "Following",
    })
    const followText = this.props.intl.formatMessage({
      id: "scene.artwork.components.followArtistLink.followButtonText.follow",
      defaultMessage: "Follow",
    })
    const followButtonText = this.props.artist.is_followed ? followingText : followText
    return (
      <Touchable onPress={() => this.handleFollowArtist()} haptic noFeedback>
        <Sans color="black60" weight="medium" size="3t" py="5px">
          {followButtonText}
        </Sans>
      </Touchable>
    )
  }
}

export const FollowArtistLinkFragmentContainer = createFragmentContainer(
  injectIntl(FollowArtistLink),
  {
    artist: graphql`
      fragment FollowArtistLink_artist on Artist {
        id
        slug
        internalID
        is_followed: isFollowed
      }
    `,
  }
)
