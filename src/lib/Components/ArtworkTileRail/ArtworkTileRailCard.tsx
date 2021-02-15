import { ArtworkTileRailCard_artwork } from "__generated__/ArtworkTileRailCard_artwork.graphql"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { GestureResponderEvent, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const IMAGE_SIZES = {
  small: 120,
  medium: 160,
  large: 240,
}

const ArtworkCard = styled.TouchableHighlight.attrs({ underlayColor: color("white100"), activeOpacity: 0.8 })``

export interface ArtworkTileRailCardProps {
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
  urgencyTag?: string | null
  lotLabel?: string | null
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
  urgencyTag = null,
  useSquareAspectRatio = false,
  lotLabel,
}) => {
  if (!!imageURL && !imageAspectRatio && !useSquareAspectRatio) {
    throw new Error("imageAspectRatio is required for non-square images")
  }

  const size = IMAGE_SIZES[imageSize]
  const imageHeight = size
  const imageWidth = useSquareAspectRatio ? size : (imageAspectRatio ?? 1) * size
  const desiredVersion = useSquareAspectRatio ? "square" : "large"

  const imageDisplay = imageURL ? (
    <View
      style={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <OpaqueImageView
        imageURL={imageURL.replace(":version", desiredVersion)}
        width={imageWidth}
        height={imageHeight}
        style={{ flex: 1 }}
      />
      {!!urgencyTag && (
        <Flex
          backgroundColor="white"
          position="absolute"
          px="5"
          py="3"
          bottom="5"
          left={5}
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Sans size="2" color="black100" numberOfLines={1}>
            {urgencyTag}
          </Sans>
        </Flex>
      )}
    </View>
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
      <Sans size="3t" color="black60" numberOfLines={1}>
        {[title, date].filter(Boolean).join(", ")}
      </Sans>
    ) : null

  const partnerDisplay = partner?.name ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      {partner.name}
    </Sans>
  ) : null

  const lotNumber = lotLabel ? (
    <Sans size="3t" color="black60" numberOfLines={1}>
      Lot {lotLabel}
    </Sans>
  ) : null

  return (
    <ArtworkCard onPress={onPress || undefined}>
      <Flex>
        {imageDisplay}
        <Box mt="1" width={imageWidth}>
          {lotNumber}
          {artistNamesDisplay}
          {titleAndDateDisplay}
          {partnerDisplay}
          {saleMessageDisplay}
        </Box>
      </Flex>
    </ArtworkCard>
  )
}

const ArtworkTileRailCardContainer: React.FC<
  Partial<ArtworkTileRailCardProps> & {
    artwork: ArtworkTileRailCard_artwork
    onPress: ArtworkTileRailCardProps["onPress"]
  }
> = ({ artwork, imageSize = "small", ...rest }) => {
  return (
    <ArtworkTileRailCard
      imageURL={artwork.image?.imageURL}
      artistNames={artwork.artistNames}
      saleMessage={artwork.saleMessage}
      imageSize={imageSize}
      useSquareAspectRatio
      {...rest}
    />
  )
}

export const ArtworkTileRailCardFragmentContainer = createFragmentContainer(ArtworkTileRailCardContainer, {
  artwork: graphql`
    fragment ArtworkTileRailCard_artwork on Artwork {
      slug
      internalID
      href
      artistNames
      image {
        imageURL
      }
      saleMessage
    }
  `,
})
