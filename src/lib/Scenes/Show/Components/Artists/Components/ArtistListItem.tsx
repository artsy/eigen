import { Box, Flex, Sans, Serif } from "@artsy/palette"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import styled from "styled-components/native"

const RoundedImage = styled(OpaqueImageView)`
  height: 45;
  width: 45;
  border-radius: 25;
  overflow: hidden;
`

const ImageAndTextWrapper = styled(Flex)`
  flex-wrap: nowrap;
`

interface Props {
  name: string
  nationality?: string
  birthday?: string
  deathday?: string
  isFollowed: boolean
  onPress: () => void
  isFollowedChanging: boolean
  url: string
}

const returnTombstoneText = (nationality, birthday, deathday) => {
  if (nationality && birthday && deathday) {
    return nationality + ", " + birthday + "-" + deathday
  } else if (nationality && birthday) {
    return nationality + ", b. " + birthday
  } else if (nationality) {
    return nationality
  } else if (birthday && deathday) {
    return birthday + "-" + deathday
  } else if (birthday) {
    return "b. " + birthday
  }
}

export const ArtistListItem: React.SFC<Props> = ({
  name,
  nationality,
  birthday,
  deathday,
  isFollowed,
  onPress,
  isFollowedChanging,
  url,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
      <ImageAndTextWrapper flexDirection="row" alignItems="center">
        <Box mr={1}>
          <RoundedImage imageURL={url} aspectRatio={1} />
        </Box>
        <Box>
          <Serif size="3t">{name}</Serif>
          <Sans size="3t" color="black60">
            {returnTombstoneText(nationality, birthday, deathday)}
          </Sans>
        </Box>
      </ImageAndTextWrapper>
      {/* TODO: Convert the width and height to a padding */}
      <Box width={84} height={34}>
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
