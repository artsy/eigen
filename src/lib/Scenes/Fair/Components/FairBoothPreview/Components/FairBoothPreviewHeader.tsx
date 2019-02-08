import { Box, Flex, Sans, Serif } from "@artsy/palette"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface Props {
  name: string
  location: string
  isFollowed?: boolean
  onPress?: () => void
  isFollowedChanging?: boolean
  url: string
  onViewFairBoothPressed: () => void
}

export const FairBoothPreviewHeader: React.SFC<Props> = ({
  name,
  location,
  isFollowed,
  onPress,
  isFollowedChanging,
  url,
  onViewFairBoothPressed,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mb={1}>
      <TouchableOpacity onPress={() => onViewFairBoothPressed()}>
        <ImageAndTextWrapper flexDirection="row" alignItems="center">
          <Box mr={1}>{url && <RoundedImage imageURL={url} aspectRatio={1} />}</Box>
          <Box>
            <TightendSerif size="2">{name}</TightendSerif>
            {location && (
              <TightendSans size="2" color="black60">
                {location}
              </TightendSans>
            )}
          </Box>
        </ImageAndTextWrapper>
      </TouchableOpacity>
      {/* TODO: Convert the width and height to a padding */}
      <Box width={102} height={34}>
        <InvertedButton
          grayBorder={true}
          text={isFollowed ? "Following" : "Follow"}
          onPress={onPress}
          selected={isFollowed}
          inProgress={isFollowedChanging}
        />
      </Box>
    </Flex>
  )
}

const RoundedImage = styled(OpaqueImageView)`
  height: 45;
  width: 45;
  border-radius: 22.5;
  overflow: hidden;
`

const TightendSerif = styled(Serif)`
  position: relative;
  top: 2;
`

const TightendSans = styled(Sans)`
  position: relative;
  top: -2;
`

const ImageAndTextWrapper = styled(Flex)`
  flex-wrap: nowrap;
`
