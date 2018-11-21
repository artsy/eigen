import { Box, Flex, Sans, Serif } from "@artsy/palette"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import React from "react"

interface Props {
  name: string
  nationality?: string
  birthday?: number
  deathday?: number
  isFollowed: boolean
  onPress: () => void
  isFollowedChanging: boolean
}

export const ArtistListItem: React.SFC<Props> = ({
  name,
  nationality,
  birthday,
  deathday,
  isFollowed,
  onPress,
  isFollowedChanging,
}) => {
  const tombstone = nationality + " " + birthday.toString() + " " + deathday.toString()
  return (
    <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
      <Box>
        <Serif size="3">{name}</Serif>
        <Sans size="3">{tombstone}</Sans>
      </Box>
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
