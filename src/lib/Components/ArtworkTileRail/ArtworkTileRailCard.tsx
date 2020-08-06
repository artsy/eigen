import { Box, color, Flex, Sans } from "@artsy/palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import styled from "styled-components/native"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const IMAGE_SIZES = {
  small: 120,
  medium: 160,
  large: 240,
}

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

interface ArtworkTileRailCardProps {
  onPress: ((event: GestureResponderEvent) => void) | null | undefined
  imageURL: string | null | undefined
  imageSize: "small" | "medium" | "large"
  saleMessage: string | null | undefined
  artistNames?: string | null | undefined
  date?: string | null | undefined
  partner?: { name: string | null } | null | undefined
  title?: string | null | undefined
  imageAspectRatio?: number | null | undefined
  useSquareAspectRatio?: boolean | null
  useLighterFont?: boolean | null
}

export const ArtworkTileRailCard: React.FC<ArtworkTileRailCardProps> = ({
  onPress,
  imageURL,
  artistNames,
  saleMessage,
  date,
  partner,
  title,
  imageAspectRatio,
  imageSize,
  useSquareAspectRatio = false,
}) => {
  const size = IMAGE_SIZES[imageSize]
  const imageHeight = size
  const imageWidth = useSquareAspectRatio ? size : (imageAspectRatio ?? 1) * size
  const desiredVersion = useSquareAspectRatio ? "square" : "large"

  const imageDisplay = imageURL ? (
    <OpaqueImageView
      imageURL={imageURL.replace(":version", desiredVersion)}
      width={imageWidth}
      height={imageHeight}
      style={{ borderRadius: 2, overflow: "hidden" }}
    />
  ) : (
    <Box bg={color("black30")} width={imageWidth} height={imageHeight} style={{ borderRadius: 2 }} />
  )

  const artistNamesDisplay = artistNames ? (
    <Sans size="3t" weight="medium" color="black100" numberOfLines={1}>
      {artistNames}
    </Sans>
  ) : null

  const saleMessageDisplay = saleMessage ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {saleMessage}
    </Sans>
  ) : null

  const titleAndDateDisplay =
    title || date ? (
      <Sans size="3t" color="black60">
        {[title, date].filter(Boolean).join(", ")}
      </Sans>
    ) : null

  const partnerDisplay = partner?.name ? (
    <Sans size="3t" color="black60">
      {partner.name}
    </Sans>
  ) : null

  return (
    <ArtworkCard onPress={onPress || undefined}>
      <Flex>
        {imageDisplay}
        <Box mt={1} width={imageWidth}>
          {artistNamesDisplay}
          {titleAndDateDisplay}
          {partnerDisplay}
          {saleMessageDisplay}
        </Box>
      </Flex>
    </ArtworkCard>
  )
}
