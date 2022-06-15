/**
 * This file is an exact copy of /Users/mounirdhahri/work/eigen/src/app/Components/ArtistListItem.tsx
 * We needed it because relay still do not support named fragment spreads for search
 */
import { OnboardingPersonalizationModal_artists$data } from "__generated__/OnboardingPersonalizationModal_artists.graphql"
import { followArtistMutation } from "app/Components/ArtistListItem"
import { navigate } from "app/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { ClassTheme, EntityHeader, Flex, FollowButton, Touchable } from "palette"
import React from "react"
import { StyleProp, TouchableWithoutFeedback, ViewStyle } from "react-native"
import { RelayPaginationProp } from "react-relay"

interface Props {
  artist: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<OnboardingPersonalizationModal_artists$data["searchConnection"]>["edges"]
        >[0]
      >
    >["node"]
  >
  relay: RelayPaginationProp
  Component?: any
  contextModule?: string
  withFeedback?: boolean
  containerStyle?: StyleProp<ViewStyle>
  disableNavigation?: boolean
  onStart?: () => void
  onFinish?: () => void
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
export class OnboardingPersonalizationArtistListItem extends React.Component<Props, State> {
  static defaultProps = {
    withFeedback: false,
    containerStyle: {},
  }

  state = { isFollowedChanging: false }

  handleFollowArtist = () => {
    const {
      relay,
      artist: { slug, id, is_followed },
      onStart,
      onFinish,
    } = this.props

    this.setState(
      {
        isFollowedChanging: true,
      },
      async () => {
        await onStart?.()
        followArtistMutation({
          environment: relay.environment,
          onCompleted: () => {
            this.handleShowSuccessfullyUpdated()
            onFinish?.()
          },
          artistID: id!,
          artistSlug: slug!,
          isFollowed: is_followed!,
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
    const { isFollowedChanging } = this.state
    const { artist, withFeedback, containerStyle, disableNavigation } = this.props
    const { is_followed, initials, image, href, name, nationality, birthday, deathday } = artist
    const imageURl = image && image.url

    const TouchableComponent = withFeedback ? Touchable : TouchableWithoutFeedback

    if (!name) {
      return null
    }

    return (
      <ClassTheme>
        {({ color }) => (
          <TouchableComponent
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
                  meta={formatTombstoneText(nationality!, birthday!, deathday!) ?? undefined}
                  imageUrl={imageURl ?? undefined}
                  initials={initials ?? undefined}
                />
              </Flex>
              <Flex>
                <FollowButton
                  haptic
                  isFollowed={!!is_followed}
                  onPress={this.handleFollowArtist.bind(this)}
                  loading={isFollowedChanging}
                />
              </Flex>
            </Flex>
          </TouchableComponent>
        )}
      </ClassTheme>
    )
  }
}
