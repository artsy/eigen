import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import { navigate } from "lib/navigation/navigate"
import { Schema, track } from "lib/utils/track"
import { Button, color, EntityHeader, Flex, Theme } from "palette"
import { Touchable } from "palette"
import React from "react"
import { StyleProp, TouchableWithoutFeedback, ViewStyle } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  artist: ArtistListItem_artist
  relay: RelayProp
  Component?: any
  contextModule?: string
  withFeedback?: boolean
  containerStyle?: StyleProp<ViewStyle>
}

interface State {
  isFollowedChanging: boolean
}

export const formatTombstoneText = (nationality: string | null, birthday: string | null, deathday: string | null) => {
  if (nationality && birthday && deathday) {
    return nationality.trim() + ", " + birthday + "-" + deathday
  } else if (nationality && birthday) {
    return nationality.trim() + ", b. " + birthday
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
  static defaultProps = {
    withFeedback: false,
    containerStyle: {},
  }

  state = { isFollowedChanging: false }

  handleFollowArtist = () => {
    const {
      relay,
      artist: { slug, id, is_followed },
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
                  is_followed: isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              artistID: slug,
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
          updater: (store) => {
            store.get(id)?.setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props: Props) => ({
    action_name: props.artist.is_followed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.artist.internalID,
    owner_slug: props.artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
    context_module: props.contextModule ? props.contextModule : null,
  }))
  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedChanging: false,
    })
  }

  @track((props: Props) => {
    return {
      action_name: Schema.ActionNames.ArtistName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: props.artist.internalID,
      owner_slug: props.artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handleTap(href: string) {
    navigate(href)
  }

  render() {
    const { isFollowedChanging } = this.state
    const { artist, withFeedback, containerStyle } = this.props
    const { is_followed, initials, image, href, name, nationality, birthday, deathday } = artist
    const imageURl = image && image.url

    const TouchableComponent = withFeedback ? Touchable : TouchableWithoutFeedback

    if (!name) {
      return null
    }

    return (
      <Theme>
        <TouchableComponent
          onPress={() => {
            if (href) {
              this.handleTap(href)
            }
          }}
          underlayColor={color("black5")}
          style={containerStyle}
        >
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Flex flex={1}>
              <EntityHeader
                mr="1"
                name={name}
                meta={formatTombstoneText(nationality, birthday, deathday) ?? undefined}
                imageUrl={imageURl ?? undefined}
                initials={initials ?? undefined}
              />
            </Flex>
            <Flex>
              <Button
                variant={is_followed ? "secondaryOutline" : "primaryBlack"}
                onPress={this.handleFollowArtist.bind(this)}
                size="small"
                loading={isFollowedChanging}
                longestText="Following"
                haptic
              >
                {is_followed ? "Following" : "Follow"}
              </Button>
            </Flex>
          </Flex>
        </TouchableComponent>
      </Theme>
    )
  }
}

export const ArtistListItemContainer = createFragmentContainer(ArtistListItem, {
  artist: graphql`
    fragment ArtistListItem_artist on Artist {
      id
      internalID
      slug
      name
      initials
      href
      is_followed: isFollowed
      nationality
      birthday
      deathday
      image {
        url
      }
    }
  `,
})
