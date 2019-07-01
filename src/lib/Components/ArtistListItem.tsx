import { Box, Button, EntityHeader, Theme } from "@artsy/palette"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: ArtistListItem_artist
  relay: RelayProp
  Component?: any
}

interface State {
  isFollowedChanging: boolean
}

export const formatTombstoneText = (nationality: string, birthday: string, deathday: string) => {
  if (nationality && birthday && deathday) {
    return nationality + ", " + birthday + "-" + deathday
  } else if (nationality && birthday) {
    return nationality + ", b. " + birthday
  } else if (nationality) {
    return nationality
  } else if (birthday && deathday) {
    return birthday + "-" + deathday
  } else if (birthday) {
    return "b. " + birthday
  } else {
    return null
  }
}

@track()
export class ArtistListItem extends React.Component<Props, State> {
  state = { isFollowedChanging: false }

  handleFollowArtist = () => {
    const {
      relay,
      artist: { gravityID, id, is_followed },
    } = this.props

    this.setState(
      {
        isFollowedChanging: true,
      },
      () => {
        commitMutation<ArtistListItemFollowArtistMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          mutation: graphql`
            mutation ArtistListItemFollowArtistMutation($input: FollowArtistInput!) {
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
              artist_id: gravityID,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followArtist: {
              artist: {
                id,
                is_followed: !is_followed,
              },
            },
          },
          updater: store => {
            store.get(id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  @track((props: Props) => ({
    action_name: props.artist.is_followed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.gravityID,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }))
  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  @track((props: Props) => {
    return {
      action_name: Schema.ActionNames.ListArtist,
      action_type: Schema.ActionTypes.Tap,
      owner_id: props.artist.internalID,
      owner_slug: props.artist.gravityID,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handleTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  getInitials = string => {
    const names = string.split(" ")
    let initials = names[0].substring(0, 1)
    if (names.length > 1) {
      initials += names[1].substring(0, 1)
    }
    return initials
  }

  render() {
    const { isFollowedChanging } = this.state
    const { artist } = this.props
    const { is_followed, initials, image, href, name, nationality, birthday, deathday } = artist
    const { url } = image

    return (
      <Theme>
        <Box width="100%" py={1}>
          <TouchableWithoutFeedback onPress={() => this.handleTap(href)}>
            <EntityHeader
              name={name}
              meta={formatTombstoneText(nationality, birthday, deathday)}
              imageUrl={url}
              initials={initials}
              FollowButton={
                <Button
                  variant={is_followed ? "secondaryOutline" : "primaryBlack"}
                  onPress={this.handleFollowArtist.bind(this)}
                  size="small"
                  loading={isFollowedChanging}
                >
                  {is_followed ? "Following" : "Follow"}
                </Button>
              }
            />
          </TouchableWithoutFeedback>
        </Box>
      </Theme>
    )
  }
}

export const ArtistListItemContainer = createFragmentContainer(ArtistListItem, {
  artist: graphql`
    fragment ArtistListItem_artist on Artist {
      id
      internalID
      gravityID
      name
      initials
      href
      is_followed
      nationality
      birthday
      deathday
      image {
        url
      }
    }
  `,
})
