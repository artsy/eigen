import { Flex, Sans, space, Box } from "@artsy/palette"
import { StyleSheet } from "react-native"
import React from "react"
import InvertedButton from "lib/Components/Buttons/InvertedButton"

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
