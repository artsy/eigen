import {
  AvatarSize,
  ClassTheme,
  EntityHeader,
  Flex,
  FollowButton,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { navigate } from "app/system/navigation/navigate"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { pluralize } from "app/utils/pluralize"
import { Schema } from "app/utils/track"
import { StyleProp, ViewStyle } from "react-native"
import {
  Environment,
  RelayProp,
  commitMutation,
  createFragmentContainer,
  graphql,
} from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  artist: ArtistListItem_artist$data
  avatarSize?: AvatarSize
  Component?: any
  containerStyle?: StyleProp<ViewStyle>
  contextModule?: string
  disableNavigation?: boolean
  onFollowFinish?: () => void
  onPress?: () => void
  isPrivate?: boolean
  relay: RelayProp
  RightButton?: JSX.Element
  showFollowButton?: boolean
  uploadsCount?: number | null
  withFeedback?: boolean
  theme?: "dark" | "light"
}

export const formatTombstoneText = (
  nationality: string | null | undefined,
  birthday: string | null | undefined,
  deathday: string | null | undefined
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

const ArtistListItem: React.FC<Props> = ({
  artist,
  avatarSize = "sm",
  containerStyle = {},
  contextModule,
  disableNavigation,
  onFollowFinish,
  onPress,
  isPrivate,
  relay,
  RightButton,
  showFollowButton = true,
  uploadsCount,
  withFeedback = false,
  theme = "light",
}) => {
  const { is_followed, initials, image, href, name, nationality, birthday, deathday } = artist

  const tracking = useTracking()

  const handleFollowArtist = async () => {
    await followArtistMutation({
      environment: relay.environment,
      onCompleted: () => {
        handleShowSuccessfullyUpdated()
        onFollowFinish?.()
      },
      artistID: artist.id,
      artistSlug: artist.slug,
      isFollowed: is_followed,
    })
  }

  const handleShowSuccessfullyUpdated = () => {
    tracking.trackEvent(tracks.successfulUpdate(artist, contextModule))
  }

  const handleTap = (href: string) => {
    tracks.tapArtistGroup(artist)
    navigate(href)
  }

  const getMeta = () => {
    const tombstoneText = formatTombstoneText(nationality, birthday, deathday)

    if (tombstoneText || Number.isInteger(uploadsCount)) {
      return (
        <Flex>
          {!!tombstoneText && (
            <Text variant="xs" color={theme === "light" ? "black60" : "white100"} numberOfLines={1}>
              {tombstoneText}
            </Text>
          )}

          {Number.isInteger(uploadsCount) && (
            <Text
              variant="xs"
              color={theme === "light" ? (uploadsCount === 0 ? "black60" : "black100") : "white100"}
            >
              {uploadsCount} {pluralize("artwork", uploadsCount || 0)} uploaded
            </Text>
          )}
        </Flex>
      )
    }

    return undefined
  }
  const meta = getMeta()

  if (!name) {
    return null
  }

  return (
    <ClassTheme>
      {({ color }) => (
        <Touchable
          noFeedback={!withFeedback}
          onPress={() => {
            if (onPress) {
              onPress()
              return
            }

            if (href && !disableNavigation) {
              handleTap(href)
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
                meta={meta}
                imageUrl={image?.url ?? undefined}
                initials={initials ?? undefined}
                avatarSize={avatarSize}
                RightButton={RightButton}
                displayPrivateIcon={isPrivate}
                theme={theme}
              />
            </Flex>
            {!!showFollowButton && (
              <Flex>
                <FollowButton haptic isFollowed={!!is_followed} onPress={handleFollowArtist}
                accessibilityLabel={is_followed ? "Unfollow " + name : "Follow " + name}
                accessibilityRole="button" />
              </Flex>
            )}
          </Flex>
        </Touchable>
      )}
    </ClassTheme>
  )
}

export const followArtistMutation = ({
  environment,
  onCompleted,
  artistSlug,
  artistID,
  isFollowed,
}: {
  environment: Environment
  onCompleted: () => void
  artistID: string
  artistSlug: string
  isFollowed: boolean | null | undefined
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
      # TOFIX: we must use coverArtwork#image here instead, this replacement is fixing
      # an Artist#coverImage got replaced by this component data with wrong data
      image {
        url(version: "small")
      }
    }
  `,
})

export const ArtistListItemPlaceholder: React.FC<{ includeCheckbox?: boolean }> = ({
  includeCheckbox,
}) => (
  <Flex flexDirection="row" py={1}>
    <PlaceholderBox height={45} width={45} borderRadius={22.5} />
    <Flex pl={1} pt={0.5} height={45}>
      <PlaceholderText height={14} width={100 + Math.random() * 50} />
      <PlaceholderText height={13} width={100 + Math.random() * 100} />
    </Flex>
    <Flex height={45} position="absolute" right={0} justifyContent="center">
      {includeCheckbox ? (
        <PlaceholderBox height={20} width={20} />
      ) : (
        <PlaceholderBox height={25} width={90} borderRadius={50} />
      )}
    </Flex>
  </Flex>
)

const tracks = {
  tapArtistGroup: (artist: Props["artist"]) => ({
    action_name: Schema.ActionNames.ArtistName,
    action_type: Schema.ActionTypes.Tap,
    owner_id: artist.internalID,
    owner_slug: artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
  }),

  successfulUpdate: (artist: Props["artist"], contextModule: string | undefined) => ({
    action_name: artist.is_followed
      ? Schema.ActionNames.ArtistFollow
      : Schema.ActionNames.ArtistUnfollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: artist.internalID,
    owner_slug: artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
    context_module: contextModule,
  }),
}
