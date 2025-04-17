import { Text, Touchable } from "@artsy/palette-mobile"
import { captureMessage } from "@sentry/react-native"
import { FollowArtistLinkMutation } from "__generated__/FollowArtistLinkMutation.graphql"
import { FollowArtistLink_artist$data } from "__generated__/FollowArtistLink_artist.graphql"
import { Schema, track } from "app/utils/track"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: FollowArtistLink_artist$data
  relay: RelayProp
  contextModule?: string
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
      onError: (error) => {
        if (__TEST__) {
          return
        } else if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`FollowArtistLinkMutation ${error?.message}`)
        }
      },
    })
  }

  render() {
    const followButtonText = this.props.artist.is_followed ? "Following" : "Follow"
    return (
      <Touchable onPress={() => this.handleFollowArtist()} haptic noFeedback>
        <Text variant="sm" color="mono60" weight="medium" py="5px">
          {followButtonText}
        </Text>
      </Touchable>
    )
  }
}

export const FollowArtistLinkFragmentContainer = createFragmentContainer(FollowArtistLink, {
  artist: graphql`
    fragment FollowArtistLink_artist on Artist {
      id
      slug
      internalID
      is_followed: isFollowed
    }
  `,
})
