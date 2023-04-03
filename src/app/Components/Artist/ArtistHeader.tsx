import { Spacer, bullet, Flex, Box, Text } from "@artsy/palette-mobile"
import { ArtistHeaderFollowArtistMutation } from "__generated__/ArtistHeaderFollowArtistMutation.graphql"
import { ArtistHeader_artist$data } from "__generated__/ArtistHeader_artist.graphql"
import { formatLargeNumberOfItems } from "app/utils/formatLargeNumberOfItems"
import { refreshOnArtistFollow } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { FollowButton } from "palette"
import { useState } from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"

export const ARTIST_HEADER_HEIGHT = 156

interface Props {
  artist: ArtistHeader_artist$data
  relay: RelayProp
}

export const ArtistHeader: React.FC<Props> = ({ artist, relay }) => {
  const { trackEvent } = useTracking()

  const [isFollowedChanging, setIsFollowedChanging] = useState(false)

  const getBirthdayString = () => {
    const birthday = artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  const handleFollowChange = () => {
    trackEvent({
      action_name: artist.isFollowed
        ? Schema.ActionNames.ArtistUnfollow
        : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: artist.internalID,
      owner_slug: artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    if (isFollowedChanging) {
      return
    }

    setIsFollowedChanging(true)

    commitMutation<ArtistHeaderFollowArtistMutation>(relay.environment, {
      mutation: graphql`
        mutation ArtistHeaderFollowArtistMutation($input: FollowArtistInput!) {
          followArtist(input: $input) {
            artist {
              id
              isFollowed
            }
          }
        }
      `,
      variables: {
        input: {
          artistID: artist.slug,
          unfollow: artist.isFollowed,
        },
      },
      // @ts-ignore RELAY 12 MIGRATION
      optimisticResponse: {
        followArtist: {
          artist: {
            id: artist.id,
            isFollowed: !artist.isFollowed,
          },
        },
      },
      onCompleted: () => successfulFollowChange(),
      onError: () => failedFollowChange(),
    })
  }

  const successfulFollowChange = () => {
    refreshOnArtistFollow()
    trackEvent({
      action_name: artist.isFollowed
        ? Schema.ActionNames.ArtistUnfollow
        : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Success,
      owner_id: artist.internalID,
      owner_slug: artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    setIsFollowedChanging(false)
  }

  const failedFollowChange = () => {
    trackEvent({
      action_name: artist.isFollowed
        ? Schema.ActionNames.ArtistFollow
        : Schema.ActionNames.ArtistUnfollow,
      action_type: Schema.ActionTypes.Fail,
      owner_id: artist.internalID,
      owner_slug: artist.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })
    // callback for analytics purposes
    setIsFollowedChanging(false)
  }

  const descriptiveString = (artist.nationality || "") + getBirthdayString()

  const bylineRequired = artist.nationality || artist.birthday

  return (
    <Box px={2} pt={6} pb={1}>
      <Text variant="lg-display">{artist.name}</Text>
      <Spacer y={1} />

      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flex={1}>
          {!!bylineRequired && (
            <Text variant="sm" mr={1}>
              {descriptiveString}
            </Text>
          )}
          <Text variant="sm">
            {formatLargeNumberOfItems(artist.counts?.artworks ?? 0, "work")}
            {!!artist?.counts?.follows && artist.counts.follows > 1 && (
              <>
                {` ${bullet} `}
                {formatLargeNumberOfItems(artist.counts.follows, "follower")}
              </>
            )}
          </Text>
        </Flex>

        <Flex>
          <FollowButton haptic isFollowed={!!artist.isFollowed} onPress={handleFollowChange} />
        </Flex>
      </Flex>
    </Box>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(ArtistHeader, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      id
      internalID
      slug
      isFollowed
      name
      nationality
      birthday
      counts {
        artworks
        follows
      }
    }
  `,
})
