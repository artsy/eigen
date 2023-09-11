import { Flex, NAVBAR_HEIGHT, ShareIcon } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
import { FollowButton } from "app/Components/Button/FollowButton"
import { TouchableOpacity } from "react-native"
import { useFragment, graphql } from "react-relay"

interface ArtistHeaderNavRightProps {
  artist: ArtistHeaderNavRight_artist$key
  onSharePress: () => void
  onFollowPress: () => void
}

export const ArtistHeaderNavRight: React.FC<ArtistHeaderNavRightProps> = ({
  artist,
  onSharePress,
  onFollowPress,
}) => {
  const { currentScrollY, scrollYOffset } = useScreenScrollContext()
  const data = useFragment(fragment, artist)

  if (!data) {
    return null
  }

  const displayFollowButton = !scrollYOffset || currentScrollY < scrollYOffset + NAVBAR_HEIGHT

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="flex-end" width={185} py={1}>
      <TouchableOpacity onPress={onSharePress}>
        <ShareIcon width={23} height={23} />
      </TouchableOpacity>

      {!!displayFollowButton && (
        <FollowButton
          haptic
          isFollowed={!!data.isFollowed}
          followCount={data.counts.follows}
          onPress={onFollowPress}
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
  }
`
