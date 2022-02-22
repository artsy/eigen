import { themeGet } from "@styled-system/theme-get"
import {
  ArtworkRailCard_artwork,
  ArtworkRailCard_artwork$key,
} from "__generated__/ArtworkRailCard_artwork.graphql"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { Flex, Sans, Text, useColor } from "palette"
import React from "react"
import { GestureResponderEvent } from "react-native"
import { graphql, useFragment } from "react-relay"
import styled from "styled-components/native"
import { saleMessageOrBidInfo } from "../ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 90
export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = {
  small: 230,
  large: 320,
}

export type ArtworkCardSize = "small" | "large"

export interface ArtworkRailCardProps {
  onPress?: (event: GestureResponderEvent) => void
  artwork: ArtworkRailCard_artwork$key
  lotLabel?: string | null
  testID?: string
  size: ArtworkCardSize
  hidePartnerName?: boolean
  hideArtistName?: boolean
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  onPress,
  testID,
  lotLabel,
  size,
  hidePartnerName = false,
  hideArtistName = false,
  ...restProps
}) => {
  const artwork = useFragment<ArtworkRailCard_artwork$key>(artworkFragment, restProps.artwork)

  const { artistNames, date, partner, title, image } = artwork

  const saleMessage = saleMessageOrBidInfo({ artwork, isSmallTile: true })
  const urgencyTag =
    artwork?.sale?.isAuction && !artwork?.sale?.isClosed
      ? getUrgencyTag(artwork?.sale?.endAt)
      : null

  return (
    <ArtworkCard onPress={onPress || undefined} testID={testID}>
      <Flex alignItems="flex-end">
        <ArtworkRailCardImage image={image} size={size} urgencyTag={urgencyTag} />
        <Flex
          mt={1}
          width={artwork.image?.resized?.width}
          style={{ height: ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT }}
        >
          {!!lotLabel && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              Lot {lotLabel}
            </Text>
          )}
          {!hideArtistName && !!artistNames && (
            <Text numberOfLines={size === "small" ? 2 : 1} lineHeight="20" variant="sm">
              {artistNames}
            </Text>
          )}
          {!!(title || date) && (
            <Text lineHeight="20" color="black60" numberOfLines={size === "small" ? 2 : 1}>
              {[title, date].filter(Boolean).join(", ")}
            </Text>
          )}
          {!hidePartnerName && !!partner?.name && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              {partner?.name}
            </Text>
          )}
          {!!saleMessage && (
            <Text lineHeight="20" variant="xs" color="black60" numberOfLines={1}>
              {saleMessage}
            </Text>
          )}
        </Flex>
      </Flex>
    </ArtworkCard>
  )
}

export interface ArtworkRailCardImageProps {
  image: ArtworkRailCard_artwork["image"]
  size: ArtworkCardSize
  urgencyTag?: string | null
}

const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({
  image,
  size,
  urgencyTag = null,
}) => {
  const color = useColor()

  const { width, height, src } = image?.resized || {}

  if (!src) {
    return (
      <Flex
        bg={color("black30")}
        width={width}
        height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size]}
        style={{ borderRadius: 2 }}
      />
    )
  }

  return (
    <Flex>
      <OpaqueImageView
        style={{ maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size] }}
        resizeMode="contain"
        imageURL={src}
        height={height || 0}
        width={width || 0}
      />
      {!!urgencyTag && (
        <Flex
          backgroundColor={color("white100")}
          position="absolute"
          px="5px"
          py="3px"
          bottom="5px"
          left="5px"
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Sans size="2" color={color("black100")} numberOfLines={1}>
            {urgencyTag}
          </Sans>
        </Flex>
      )}
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworkRailCard_artwork on Artwork @argumentDefinitions(width: { type: "Int" }) {
    id
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
    realizedPrice
  }
`

const ArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``
