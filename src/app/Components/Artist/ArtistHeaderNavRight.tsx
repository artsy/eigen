import { ShareIcon } from "@artsy/icons/native"
import { Flex, FollowButton, Screen, useSpace } from "@artsy/palette-mobile"
import { ArtistHeaderNavRightQuery } from "__generated__/ArtistHeaderNavRightQuery.graphql"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { MotiView } from "moti"
import { useCallback, useState } from "react"
import { PixelRatio, TouchableOpacity } from "react-native"
import { useAnimatedStyle } from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface ArtistHeaderNavRightProps {
  artist: ArtistHeaderNavRight_artist$key
}

const CONTAINER_WIDTH = 185 * PixelRatio.getFontScale()

export const ArtistHeaderNavRight: React.FC<ArtistHeaderNavRightProps> = ({
  artist: artistProp,
}) => {
  const space = useSpace()
  const artist = useFragment(fragment, artistProp)
  const [isFollowed, setIsFollowed] = useState(!!artist?.isFollowed)

  const { showShareSheet } = useShareSheet()
  const { handleFollowToggle } = useFollowArtist(artist)

  const { opacity } = Screen.useTitleStyles()

  useDebounce(
    () => {
      if (isFollowed !== artist?.isFollowed) {
        handleFollowToggle()
      }
    },
    350,
    [isFollowed]
  )

  const followButtonStyle = useAnimatedStyle(() => ({
    // If the title is hidden, the follow button should be visible
    opacity: opacity.value ? 0 : 1,
  }))

  const handleSharePress = useCallback(() => {
    if (artist?.name && artist?.name && artist?.slug && artist?.href) {
      showShareSheet({
        type: "artist",
        internalID: artist.internalID,
        slug: artist.slug,
        artists: [{ name: artist.name ?? null }],
        title: artist.name,
        href: artist.href,
        currentImageUrl: artist.shareImage?.image?.url ?? undefined,
      })
    }
  }, [artist, showShareSheet])

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      width={CONTAINER_WIDTH}
      py={1}
    >
      <MotiView style={[followButtonStyle, { marginRight: space(0.5) }]}>
        <FollowButton
          haptic
          isFollowed={isFollowed}
          followCount={artist?.counts.follows}
          onPress={() => setIsFollowed(!isFollowed)}
        />
      </MotiView>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Share"
        onPress={handleSharePress}
      >
        <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
      </TouchableOpacity>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtistHeaderNavRight_artist on Artist {
    isFollowed
    counts @required(action: NONE) {
      follows
    }
    name
    slug
    href
    internalID
    shareImage: coverArtwork {
      image {
        url
      }
    }
    ...useFollowArtist_artist
  }
`

const artistHeaderNavRightQuery = graphql`
  query ArtistHeaderNavRightQuery($artistID: String!) {
    artist(id: $artistID) @required(action: NONE) {
      ...ArtistHeaderNavRight_artist
    }
  }
`

interface ArtistHeaderNavRightQueryRendererProps {
  artistID: string
}

export const ArtistHeaderNavRightQueryRenderer: React.FC<ArtistHeaderNavRightQueryRendererProps> =
  withSuspense({
    Component: ({ artistID }) => {
      const data = useLazyLoadQuery<ArtistHeaderNavRightQuery>(artistHeaderNavRightQuery, {
        artistID,
      })

      if (!data?.artist) {
        return null
      }

      return <ArtistHeaderNavRight artist={data.artist} />
    },
    // We don't want to show a loading fallback here because it degrades the UX in this case
    LoadingFallback: () => <Flex />,
    // We don't want to show an error fallback just because the button didn't render
    // We would still capture it though
    ErrorFallback: NoFallback,
  })
