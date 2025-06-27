import { ShareIcon } from "@artsy/icons/native"
import { Flex, FollowButton, NAVBAR_HEIGHT, useSpace } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { MotiView } from "moti"
import { useState } from "react"
import { PixelRatio, TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface ArtistHeaderNavRightProps {
  artist: ArtistHeaderNavRight_artist$key
  onSharePress: () => void
}

const CONTAINER_WIDTH = 185 * PixelRatio.getFontScale()

export const ArtistHeaderNavRight: React.FC<ArtistHeaderNavRightProps> = ({
  artist,
  onSharePress,
}) => {
  const space = useSpace()
  const { currentScrollY, scrollYOffset } = useScreenScrollContext()
  const data = useFragment(fragment, artist)
  const [isFollowed, setIsFollowed] = useState(!!data?.isFollowed)

  const { handleFollowToggle } = useFollowArtist(data)

  useDebounce(
    () => {
      if (isFollowed !== data?.isFollowed) {
        handleFollowToggle()
      }
    },
    350,
    [isFollowed]
  )

  const displayFollowButton = !scrollYOffset || currentScrollY < scrollYOffset + NAVBAR_HEIGHT

  // The container width minus the share icon width minus the padding on the left and right
  const followButtonWidth = CONTAINER_WIDTH - ACCESSIBLE_DEFAULT_ICON_SIZE - space(2)

  return (
    <MotiView
      animate={{
        transform: [
          {
            translateX: displayFollowButton
              ? 0
              : CONTAINER_WIDTH -
                ACCESSIBLE_DEFAULT_ICON_SIZE -
                space(1) * PixelRatio.getFontScale(),
          },
        ],
      }}
      transition={{
        type: "timing",
        duration: 200,
      }}
    >
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
          onPress={onSharePress}
        >
          <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
        </TouchableOpacity>

        <MotiView
          animate={{
            opacity: displayFollowButton ? 1 : 0,
          }}
          transition={{
            type: "timing",
            duration: 200,
          }}
        >
          <FollowButton
            haptic
            isFollowed={isFollowed}
            longestText="Following 999.9k"
            followCount={data?.counts.follows}
            onPress={() => setIsFollowed(!isFollowed)}
            ml={1}
            // Using maxWidth and minWidth to prevent the button from changing width when the text changes
            maxWidth={followButtonWidth}
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
    ...useFollowArtist_artist
  }
`
