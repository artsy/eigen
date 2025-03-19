import { Flex } from "@artsy/palette-mobile"
import { FollowedArtistsQueryRenderer } from "app/Scenes/Favorites/Components/FollowedArtists"

export const FollowsTab = () => {
  return (
    <Flex flex={1}>
      <FollowedArtistsQueryRenderer />
    </Flex>
  )
}
