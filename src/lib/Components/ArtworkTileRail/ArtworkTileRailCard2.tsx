import { themeGet } from "@styled-system/theme-get"
import {
  ArtworkTileRailCard2_artwork,
  ArtworkTileRailCard2_artwork$key,
} from "__generated__/ArtworkTileRailCard2_artwork.graphql"
import { getUrgencyTag } from "lib/utils/getUrgencyTag"
import { Box, Flex, Sans, Text, useColor } from "palette"
import React from "react"
import { GestureResponderEvent, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import styled from "styled-components/native"
import { saleMessageOrBidInfo } from "../ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const MAX_IMAGE_HEIGHTS = {
  small: 320,
  medium: 320,
  large: 320,
}

type Size = "small" | "medium" | "large"

export interface ArtworkTileRailCard2Props {
  onPress?: (event: GestureResponderEvent) => void
  artwork: ArtworkTileRailCard2_artwork$key
  lotLabel?: string | null
  testID?: string
  size: Size
}

export const ArtworkTileRailCard2: React.FC<ArtworkTileRailCard2Props> = ({
  onPress,
  testID,
  lotLabel,
  size,
  ...restProps
}) => {
  const artwork = useFragment<ArtworkTileRailCard2_artwork$key>(artworkFragment, restProps.artwork)

  const { artistNames, date, partner, title, image } = artwork

  const saleMessage = saleMessageOrBidInfo({ artwork, isSmallTile: true })
  const urgencyTag = artwork?.sale?.isAuction && !artwork?.sale?.isClosed ? getUrgencyTag(artwork?.sale?.endAt) : null

  return (
    <ArtworkCard onPress={onPress || undefined} testID={testID}>
      <Flex>
        <ArtworkTileImage image={image} size={size} urgencyTag={urgencyTag} />
        <Box mt={1} width={artwork.image?.resized?.width}>
          {!!lotLabel && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              Lot {lotLabel}
            </Text>
          )}
          {!!artistNames && (
            <Text numberOfLines={1} lineHeight="20" variant="sm">
              {artistNames}saleArtwork
            </Text>
          )}
          {!!(title || date) && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              {[title, date].filter(Boolean).join(", ")}
            </Text>
          )}
          {!!partner?.name && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              {partner?.name}
            </Text>
          )}
          {!!saleMessage && (
            <Text lineHeight="20" variant="xs" color="black60" numberOfLines={1}>
              {saleMessage}
            </Text>
          )}
        </Box>
      </Flex>
    </ArtworkCard>
  )
}

export interface ArtworkTileImageProps {
  image: ArtworkTileRailCard2_artwork["image"]
  size: Size
  urgencyTag?: string | null
}

const ArtworkTileImage: React.FC<ArtworkTileImageProps> = ({ image, size, urgencyTag = null }) => {
  const color = useColor()

  const { width, height, src } = image?.resized || {}

  if (!image?.resized?.src) {
    return <Box bg={color("black30")} width={width} height={height} style={{ borderRadius: 2 }} />
  }
  return (
    <View
      style={{
        borderRadius: 2,
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <OpaqueImageView
        style={{ maxHeight: MAX_IMAGE_HEIGHTS[size] }}
        resizeMode="contain"
        imageURL={src}
        height={height || 0}
        width={width || 0}
      />
      {!!urgencyTag && (
        <Flex
          backgroundColor="white"
          position="absolute"
          px="5px"
          py="3px"
          bottom="5px"
          left="5px"
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Sans size="2" color="black100" numberOfLines={1}>
            {urgencyTag}
          </Sans>
        </Flex>
      )}
    </View>
  )
}

const artworkFragment = graphql`
  fragment ArtworkTileRailCard2_artwork on Artwork @argumentDefinitions(width: { type: "Int", defaultValue: 160 }) {
    slug
    internalID
    href
    artistNames
    date
    image {
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
      aspectRatio
      height
    }
    sale {
      isAuction
      isClosed
      endAt
    }
    saleMessage
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
    }
    partner {
      name
    }
    title
  }
`

const ArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``
