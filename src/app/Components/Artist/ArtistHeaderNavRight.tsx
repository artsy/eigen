import { ShareIcon } from "@artsy/icons/native"
import { Flex, FollowButton, NAVBAR_HEIGHT, useSpace } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeaderNavRightQuery } from "__generated__/ArtistHeaderNavRightQuery.graphql"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { MotiView } from "moti"
import { useCallback, useState } from "react"
import { PixelRatio, TouchableOpacity } from "react-native"
import { Easing, useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated"
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
  const { currentScrollYAnimated, scrollYOffset } = useScreenScrollContext()
  const artist = useFragment(fragment, artistProp)
  const [isFollowed, setIsFollowed] = useState(!!artist?.isFollowed)

  const { showShareSheet } = useShareSheet()
  const { handleFollowToggle } = useFollowArtist(artist)

  // The container width minus the share icon width minus the padding on the left and right
  const followButtonWidth = CONTAINER_WIDTH - ACCESSIBLE_DEFAULT_ICON_SIZE - space(2)

  useDebounce(
    () => {
      if (isFollowed !== artist?.isFollowed) {
        handleFollowToggle()
      }
    },
    350,
    [isFollowed]
  )

  const followAreaDeltaX = (followButtonWidth + space(2)) * PixelRatio.getFontScale()
  const displayFollowButton = useDerivedValue(() => {
    return !scrollYOffset || currentScrollYAnimated.value < scrollYOffset + NAVBAR_HEIGHT
  })

  // convert the space into primitive types to be user on the UI thread
  const space1 = space(1)
  const space2 = space(2)
  const spacerWidth = useDerivedValue(
    () => (displayFollowButton.value ? space1 : space2),
    [space1, space2]
  )
  const followButtonTranslateX = useDerivedValue(() =>
    displayFollowButton.value ? 0 : followAreaDeltaX
  )
  const followButtonOpacity = useDerivedValue(() => (displayFollowButton.value ? 1 : 0))

  const viewStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: withTiming(followButtonTranslateX.value, {
            duration: 200,
            easing: Easing.sin,
          }),
        },
      ],
    }),
    [followAreaDeltaX]
  )
  const spacerStyle = useAnimatedStyle(() => ({
    width: withTiming(spacerWidth.value, { duration: 200 }),
  }))
  const followButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(followButtonOpacity.value, { duration: 200 }),
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
    <MotiView style={viewStyle}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        width={CONTAINER_WIDTH}
        py={1}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={handleSharePress}
        >
          <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
        </TouchableOpacity>

        <MotiView style={spacerStyle} />

        <MotiView style={followButtonStyle}>
          <FollowButton
            haptic
            isFollowed={isFollowed}
            longestText="Following 999.9k"
            followCount={artist?.counts.follows}
            onPress={() => setIsFollowed(!isFollowed)}
            minWidth={followButtonWidth}
          />
        </MotiView>
      </Flex>
    </MotiView>
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
