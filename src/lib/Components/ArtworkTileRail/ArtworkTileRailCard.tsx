import { Box, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import styled from "styled-components/native"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const SMALL_TILE_IMAGE_SIZE = 120

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

interface ArtworkTileRailCardProps {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined
  imageURL: string | null | undefined
  artistNames: string | null | undefined
  saleMessage: string | null | undefined
}

export const ArtworkTileRailCard: React.FC<ArtworkTileRailCardProps> = ({
  onPress,
  imageURL,
  artistNames,
  saleMessage,
}) => {
  const imageDisplay = imageURL ? (
    <OpaqueImageView
      imageURL={imageURL.replace(":version", "square")}
      width={SMALL_TILE_IMAGE_SIZE}
      height={SMALL_TILE_IMAGE_SIZE}
      style={{ borderRadius: 2, overflow: "hidden" }}
    />
  ) : (
    <Box
      bg={color("black30")}
      width={SMALL_TILE_IMAGE_SIZE}
      height={SMALL_TILE_IMAGE_SIZE}
      style={{ borderRadius: 2 }}
    />
  )

  const artistNamesDisplay = artistNames ? (
    <Sans size="3t" weight="medium" numberOfLines={1}>
      {artistNames}
    </Sans>
  ) : null

  const saleMessageDisplay = saleMessage ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {saleMessage}
    </Sans>
  ) : null

  return (
    <ArtworkCard onPress={onPress || undefined}>
      <Flex>
        {imageDisplay}
        <Box mt={1} width={SMALL_TILE_IMAGE_SIZE}>
          {artistNamesDisplay}
          {saleMessageDisplay}
        </Box>
      </Flex>
    </ArtworkCard>
  )
}
