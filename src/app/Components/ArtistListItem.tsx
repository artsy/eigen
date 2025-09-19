import { MoreIcon } from "@artsy/icons/native"
import {
  AvatarSize,
  EntityHeader,
  Flex,
  FollowButton,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { ArtistListItemFollowArtistMutation } from "__generated__/ArtistListItemFollowArtistMutation.graphql"
import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
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
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  disableNavigation?: boolean
  onFollowFinish?: () => void
  onPress?: () => void
  includeTombstone?: boolean
  isPrivate?: boolean
  relay: RelayProp
  RightButton?: React.JSX.Element
  showFollowButton?: boolean
  uploadsCount?: number | null
  withFeedback?: boolean
  theme?: "dark" | "light"
  showMoreIcon?: boolean
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
  contextScreenOwnerId,
  contextScreenOwnerSlug,
  disableNavigation,
  onFollowFinish,
  onPress,
  includeTombstone = true,
  isPrivate,
  relay,
  RightButton,
  showFollowButton = true,
  uploadsCount,
  withFeedback = false,
  theme = "light",
  showMoreIcon = false,
}) => {
  const color = useColor()
  const { is_followed, initials, href, name, nationality, birthday, deathday } = artist

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
    tracking.trackEvent(
      tracks.successfulUpdate(artist, contextModule, contextScreenOwnerId, contextScreenOwnerSlug)
    )
  }

  let meta

  if (includeTombstone) {
    const getMeta = () => {
      const tombstoneText = formatTombstoneText(nationality, birthday, deathday)

      if (tombstoneText || Number.isInteger(uploadsCount)) {
        return (
          <Flex>
            {!!tombstoneText && (
              <Text variant="xs" color={theme === "light" ? "mono60" : "mono0"} numberOfLines={1}>
                {tombstoneText}
              </Text>
            )}

            {Number.isInteger(uploadsCount) && (
              <Text
                variant="xs"
                color={theme === "light" ? (uploadsCount === 0 ? "mono60" : "mono100") : "mono0"}
              >
                {uploadsCount} {pluralize("artwork", uploadsCount || 0)} uploaded
              </Text>
            )}
          </Flex>
        )
      }

      return undefined
    }

    meta = getMeta()
  }

  if (!name) {
    return null
  }

  const callOnPress = () => {
    onPress?.()

    if (href && !disableNavigation) {
      tracks.tapArtistGroup(artist)
    }
  }

  return (
    <RouterLink
      noFeedback={!withFeedback}
      // Only navigate if there is an href and navigation is not disabled by passing `onPress` or
      to={!disableNavigation ? href : undefined}
      onPress={() => callOnPress()}
      underlayColor={color("mono5")}
      style={containerStyle}
    >
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
        <Flex flex={1}>
          <EntityHeader
            mr={1}
            name={name}
            meta={meta}
            imageUrl={artist.coverArtwork?.image?.url ?? artist.image?.url ?? undefined}
            initials={initials ?? undefined}
            avatarSize={avatarSize}
            RightButton={RightButton}
            displayPrivateIcon={isPrivate}
            theme={theme}
          />
        </Flex>
        {!!showMoreIcon && (
          <Touchable accessibilityRole="button" onPress={() => callOnPress()} testID="more-icon">
            <MoreIcon />
          </Touchable>
        )}
        {!!showFollowButton && (
          <Flex>
            <FollowButton
              testID="follow-artist-button"
              haptic
              isFollowed={!!is_followed}
              onPress={handleFollowArtist}
            />
          </Flex>
        )}
      </Flex>
    </RouterLink>
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
      coverArtwork {
        image {
          # Requesting "small" causes this fragment to be refetched unexpectedly because the relay
          # store usually contains artists with "larger" cover artworks (see ArtistScreenQuery).
          # We can also disable prefetching on the RouterLink to avoid this, but it is better to
          # prefetch a larger image than it is to make a additional requests for a smaller one.
          url(version: "larger")
        }
      }
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

  successfulUpdate: (
    artist: Props["artist"],
    contextModule: string | undefined,
    contextScreenOwnerId?: string | undefined,
    contextScreenOwnerSlug?: string | undefined
  ) => ({
    action_name: artist.is_followed
      ? Schema.ActionNames.ArtistUnfollow
      : Schema.ActionNames.ArtistFollow,
    action_type: Schema.ActionTypes.Success,
    owner_id: artist.internalID,
    owner_slug: artist.slug,
    owner_type: Schema.OwnerEntityTypes.Artist,
    context_module: contextModule,
    context_screen_owner_id: contextScreenOwnerId,
    context_screen_owner_slug: contextScreenOwnerSlug,
  }),
}
