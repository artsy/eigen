import { Box, Button, Flex, Sans, Serif, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface Props {
  name: string
  location: string
  isFollowed?: boolean
  onFollowPartner?: () => void
  isFollowedChanging?: boolean
  url: string
  onViewFairBoothPressed: () => void
}

const roundedImageSize = 45

export const FairBoothPreviewHeader: React.SFC<Props> = ({
  name,
  location,
  isFollowed,
  onFollowPartner,
  isFollowedChanging,
  url,
  onViewFairBoothPressed,
}) => {
  const buttonWidth = 95
  const partnerNameWidth = Dimensions.get("window").width - buttonWidth - roundedImageSize - space(4) - space(1)
  return (
    <Flex justifyContent="space-between" alignItems="center" flexDirection="row" mb={1}>
      <TouchableOpacity onPress={() => onViewFairBoothPressed()}>
        <ImageAndTextWrapper flexDirection="row" alignItems="center">
          <Box mr={1}>{!!url && <RoundedImage imageURL={url} aspectRatio={1} />}</Box>
          <Box width={partnerNameWidth}>
            <TightendSerif size="2">{name}</TightendSerif>
            {!!location && (
              <TightendSans size="2" color="black60">
                {location}
              </TightendSans>
            )}
          </Box>
        </ImageAndTextWrapper>
      </TouchableOpacity>
      {isFollowed !== null && (
        <Button
          variant={isFollowed ? "secondaryOutline" : "primaryBlack"}
          onPress={onFollowPartner}
          size="small"
          loading={isFollowedChanging}
          longestText="Following"
        >
          {isFollowed ? "Following" : "Follow"}
        </Button>
      )}
    </Flex>
  )
}

const RoundedImage = styled(OpaqueImageView)`
  height: ${roundedImageSize};
  width: ${roundedImageSize};
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
