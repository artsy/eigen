import { Box, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import styled from "styled-components/native"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const SMALL_TILE_IMAGE_SIZE = 120
const LARGE_TILE_IMAGE_SIZE = 240

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

interface ArtworkTileRailCardProps {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined
  imageURL: string | null | undefined
  artistNames: string | null | undefined
  saleMessage: string | null | undefined
  useLargeImageSize?: boolean | null
  useNormalFontWeight?: boolean | null
  useLighterFont?: boolean | null
}

export const ArtworkTileRailCard: React.FC<ArtworkTileRailCardProps> = ({
  onPress,
  imageURL,
  artistNames,
  saleMessage,
  useLargeImageSize,
  useNormalFontWeight,
  useLighterFont,
}) => {
  const imageDisplay = imageURL ? (
    <OpaqueImageView
      imageURL={imageURL.replace(":version", useLargeImageSize ? "large" : "square")}
      width={useLargeImageSize ? LARGE_TILE_IMAGE_SIZE : SMALL_TILE_IMAGE_SIZE}
      height={useLargeImageSize ? LARGE_TILE_IMAGE_SIZE : SMALL_TILE_IMAGE_SIZE}
      style={{ borderRadius: 2, overflow: "hidden" }}
    />
  ) : (
    <Box
      bg={color("black30")}
      width={useLargeImageSize ? LARGE_TILE_IMAGE_SIZE : SMALL_TILE_IMAGE_SIZE}
      height={useLargeImageSize ? LARGE_TILE_IMAGE_SIZE : SMALL_TILE_IMAGE_SIZE}
      style={{ borderRadius: 2 }}
    />
  )

  const artistNamesDisplay = artistNames ? (
    <Sans
      size="3t"
      weight={useNormalFontWeight ? "regular" : "medium"}
      color={useLighterFont ? "black60" : "black100"}
      numberOfLines={1}
    >
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
        <Box mt={1} width={useLargeImageSize ? LARGE_TILE_IMAGE_SIZE : SMALL_TILE_IMAGE_SIZE}>
          {artistNamesDisplay}
          {saleMessageDisplay}
        </Box>
      </Flex>
    </ArtworkCard>
  )
}
