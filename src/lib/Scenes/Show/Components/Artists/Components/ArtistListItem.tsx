import { Box, Flex, Sans } from "@artsy/palette"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import React from "react"

interface Props {
  name: string
  isFollowed: boolean
  onPress: () => void
  isFollowedChanging: boolean
}

export const ArtistListItem: React.SFC<Props> = ({ name, isFollowed, onPress, isFollowedChanging }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
      <Sans size="3">{name}</Sans>
      {/* TODO: Remove hardcoded sizes once designs firm up */}
      <Box width={112} height={32}>
        <InvertedButton
          text={isFollowed ? "Following" : "Follow"}
          onPress={onPress}
          selected={isFollowed}
          inProgress={isFollowedChanging}
        />
      </Box>
    </Flex>
  )
}
