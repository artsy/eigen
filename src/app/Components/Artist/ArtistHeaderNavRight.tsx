import { Flex, FollowButton, NAVBAR_HEIGHT, ShareIcon } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface ArtistHeaderNavRightProps {
  artist: ArtistHeaderNavRight_artist$key
  onSharePress: () => void
}

export const ArtistHeaderNavRight: React.FC<ArtistHeaderNavRightProps> = ({
  artist,
  onSharePress,
}) => {
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

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="flex-end" width={185} py={1}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Share"
        onPress={onSharePress}
      >
        <ShareIcon width={23} height={23} />
      </TouchableOpacity>

      {!!displayFollowButton && (
        <FollowButton
          haptic
          isFollowed={isFollowed}
          longestText="Following 999.9k"
          followCount={data?.counts.follows}
          onPress={() => setIsFollowed(!isFollowed)}
          ml={1}
        />
      )}
    </Flex>
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
