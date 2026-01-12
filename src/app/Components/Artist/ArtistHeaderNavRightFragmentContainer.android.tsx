import { ShareIcon } from "@artsy/icons/native"
import { Flex, FollowButton, NAVBAR_HEIGHT, useSpace } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { artistHeaderNavRightFragment } from "app/Components/Artist/ArtistHeaderNavRight"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { useCallback, useState } from "react"
import { PixelRatio, TouchableOpacity } from "react-native"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { useFragment } from "react-relay"
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
  const artist = useFragment(artistHeaderNavRightFragment, artistProp)
  const [isFollowed, setIsFollowed] = useState(!!artist?.isFollowed)
  const [showFollowButton, setShowFollowButton] = useState(true)

  const { showShareSheet } = useShareSheet()
  const { handleFollowToggle } = useFollowArtist(artist)

  useAnimatedReaction(
    () => {
      return !scrollYOffset || currentScrollYAnimated.value + 50 < scrollYOffset + NAVBAR_HEIGHT
    },
    (shouldShow) => {
      runOnJS(setShowFollowButton)(shouldShow)
    },
    [scrollYOffset]
  )

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
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Share"
        onPress={handleSharePress}
      >
        <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
      </TouchableOpacity>

      {showFollowButton ? (
        <FollowButton
          haptic
          isFollowed={isFollowed}
          longestText="Following 999.9k"
          followCount={artist?.counts.follows}
          onPress={() => setIsFollowed(!isFollowed)}
          // Using maxWidth and minWidth to prevent the button from changing width when the text changes
          maxWidth={followButtonWidth}
          minWidth={followButtonWidth}
        />
      ) : null}
    </Flex>
  )
}
