import { ArtistHeader_artist } from "__generated__/ArtistHeader_artist.graphql"
import { ArtistHeaderFollowArtistMutation } from "__generated__/ArtistHeaderFollowArtistMutation.graphql"
import { userHadMeaningfulInteraction } from "lib/NativeModules/Events"
import { formatLargeNumberOfItems } from "lib/utils/formatLargeNumberOfItems"
import { PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Box, bullet, Button, Flex, Sans, Spacer, Theme } from "palette"
import React, { useState } from "react"
import { PixelRatio, Text } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { Schema } from "../../utils/track"

export const ARTIST_HEADER_HEIGHT = 156

interface Props {
  artist?: ArtistHeader_artist | null
  relay: RelayProp
}

export const ArtistHeader: React.FC<Props> = ({ artist, relay }) => {
  const { internalID, id, slug, counts, name, isFollowed, nationality, birthday } = artist || {}

  const { trackEvent } = useTracking()

  const [isFollowedChanging, setIsFollowedChanging] = useState<boolean>(false)

  const followersCount = counts?.follows ?? 0

  const getBirthdayString = () => {
    if (!birthday) {
      return ""
    }

    const leadingSubstring = nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  const handleFollowChange = () => {
    trackEvent({
      action_name: isFollowed ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: internalID,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    if (isFollowedChanging) {
      return
    }

    setIsFollowedChanging(true)

    commitMutation<ArtistHeaderFollowArtistMutation>(relay.environment, {
      onCompleted: () => successfulFollowChange(),
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
          artistID: slug || "",
          unfollow: isFollowed,
        },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            id: id || "",
            isFollowed: !isFollowed,
          },
        },
      },
      onError: () => failedFollowChange(),
    })
  }

  const successfulFollowChange = () => {
    trackEvent({
      action_name: isFollowed ? Schema.ActionNames.ArtistUnfollow : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Success,
      owner_id: internalID,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    // callback for analytics purposes
    userHadMeaningfulInteraction()
    setIsFollowedChanging(false)
  }

  const failedFollowChange = () => {
    trackEvent({
      action_name: isFollowed ? Schema.ActionNames.ArtistFollow : Schema.ActionNames.ArtistUnfollow,
      action_type: Schema.ActionTypes.Fail,
      owner_id: internalID,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })
    // callback for analytics purposes
    setIsFollowedChanging(false)
  }

  const descriptiveString = (nationality || "") + getBirthdayString()

  const bylineRequired = nationality || birthday

  return (
    <Box px={2} pt={6} pb={1}>
      <Sans size="8">{name}</Sans>
      <Spacer mb={1} />
      {Boolean(followersCount || bylineRequired) && (
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            {!!bylineRequired && (
              <Sans mr={1} size="3t">
                {descriptiveString}
              </Sans>
            )}
            <Sans size="3t">
              {formatLargeNumberOfItems(counts?.artworks ?? 0, "work")}
              {` ${bullet} `}
              {formatLargeNumberOfItems(counts?.follows ?? 0, "follower")}
            </Sans>
          </Flex>
          <Flex>
            <Button
              variant={isFollowed ? "secondaryOutline" : "primaryBlack"}
              onPress={handleFollowChange}
              size="small"
              longestText="Following"
              haptic
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          </Flex>
        </Flex>
      )}
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

export const ArtistHeaderPlaceholder: React.FC = () => {
  const fontScale = PixelRatio.getFontScale()

  return (
    <ProvidePlaceholderContext>
      <Theme>
        <Flex>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
            <Flex>
              <Spacer mb={58} />
              {/* Entity name */}
              <PlaceholderText width={180} height={26 * fontScale} />
              <Spacer mb={1} />
              {/* subtitle text */}
              <PlaceholderText width={100} height={19 * fontScale} />
              {/* more subtitle text */}
              <PlaceholderText width={150} height={19 * fontScale} />
            </Flex>
            <PlaceholderText width={85} height={32 * fontScale} alignSelf="flex-end" />
          </Flex>
          <Spacer mb={0.5 * fontScale} />
        </Flex>
      </Theme>
    </ProvidePlaceholderContext>
  )
}

export const TextWrapper = styled(Text)``
