import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import { navigate } from "app/navigation/navigate"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { Schema, track } from "app/utils/track"
import { ClassTheme, EntityHeader, Flex, FollowButton, Touchable } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

interface Props {
  artist: ArtistListItem_artist
  relay: RelayProp
  Component?: any
  contextModule?: string
  withFeedback?: boolean
  containerStyle?: StyleProp<ViewStyle>
  disableNavigation?: boolean
  onFollowFinish?: () => void
}

interface State {
  isFollowedChanging: boolean
}

export const formatTombstoneText = (
  nationality: string | null,
  birthday: string | null,
  deathday: string | null
) => {
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
      onFollowFinish,
    } = this.props

    this.setState(
      {
        isFollowedChanging: true,
      },
      async () => {
        followArtistMutation({
          environment: relay.environment,
          onCompleted: () => {
            this.handleShowSuccessfullyUpdated()
            onFollowFinish?.()
          },
          artistID: id,
          artistSlug: slug,
          isFollowed: is_followed,
        })
      }
    )
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  @track((props: Props) => ({
    action_name: props.artist.is_followed
      ? Schema.ActionNames.ArtistFollow
      : Schema.ActionNames.ArtistUnfollow,
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
    const { artist, withFeedback, containerStyle, disableNavigation } = this.props
    const { is_followed, initials, image, href, name, nationality, birthday, deathday } = artist
    const imageURl = image && image.url

    if (!name) {
      return null
    }

    return (
      <ClassTheme>
        {({ color }) => (
          <Touchable
            noFeedback={!withFeedback}
            onPress={() => {
              if (href && !disableNavigation) {
                this.handleTap(href)
              }
            }}
            underlayColor={color("black5")}
            style={containerStyle}
          >
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <Flex flex={1}>
                <EntityHeader
                  mr={1}
                  name={name}
                  meta={formatTombstoneText(nationality, birthday, deathday) ?? undefined}
                  imageUrl={imageURl ?? undefined}
                  initials={initials ?? undefined}
                />
              </Flex>
              <Flex>
                <FollowButton
                  haptic
                  isFollowed={!!is_followed}
                  onPress={this.handleFollowArtist.bind(this)}
                />
              </Flex>
            </Flex>
          </Touchable>
        )}
      </ClassTheme>
    )
  }
}

export const followArtistMutation = ({
  environment,
  onCompleted,
  artistSlug,
  artistID,
  isFollowed,
}: {
  environment: RelayModernEnvironment
  onCompleted: () => void
  artistID: string
  artistSlug: string
  isFollowed: boolean | null
}) =>
  commitMutation<ArtistListItemFollowArtistMutation>(environment, {
    onCompleted,
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
        artistID: artistSlug,
        unfollow: isFollowed,
      },
    },
    // @ts-ignore RELAY 12 MIGRATION
    optimisticResponse: {
      followArtist: {
        artist: {
          id: artistID,
          is_followed: !isFollowed,
        },
      },
    },
    updater: (store) => {
      store.get(artistID)?.setValue(!isFollowed, "is_followed")
    },
  })

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

export const ArtistListItemPlaceholder = () => (
  <Flex flexDirection="row">
    <PlaceholderBox height={45} width={45} borderRadius={22.5} />
    <Flex pl={1} pt={0.5} height={45}>
      <PlaceholderText height={14} width={100 + Math.random() * 50} />
      <PlaceholderText height={13} width={100 + Math.random() * 100} />
    </Flex>
    <Flex height={45} position="absolute" right={0} justifyContent="center">
      <PlaceholderBox height={25} width={70} borderRadius={2} />
    </Flex>
  </Flex>
)
