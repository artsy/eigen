import { themeGet } from "@styled-system/theme-get"
import { ArtworkTileRailCard_artwork } from "__generated__/ArtworkTileRailCard_artwork.graphql"
import { useSizeToFitScreen } from "lib/utils/useSizeToFit"
import { Box, Flex, Sans, Text, useColor } from "palette"
import React from "react"
import { GestureResponderEvent, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

const IMAGE_SIZES = {
  small: 155,
  medium: 160,
  large: 295,
}

const ArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``

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
  testID?: string
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
  testID,
}) => {
  const color = useColor()
  if (!!imageURL && !imageAspectRatio && !useSquareAspectRatio) {
    throw new Error("imageAspectRatio is required for non-square images")
  }

  const size = IMAGE_SIZES[imageSize]
  const imageWidth = size
  const imageHeight = useSquareAspectRatio ? size : size / (imageAspectRatio ?? 1)
  const desiredVersion = useSquareAspectRatio ? "square" : "large"

  const { width, height } = useSizeToFitScreen({
    width: imageWidth,
    height: imageHeight,
  })

  const imageDisplay = imageURL ? (
    <View
      style={{
        borderRadius: 2,
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <OpaqueImageView imageURL={imageURL.replace(":version", desiredVersion)} width={width} height={height} />
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
  ) : (
    <Box bg={color("black30")} width={imageWidth} height={imageHeight} style={{ borderRadius: 2 }} />
  )

  const artistNamesDisplay = artistNames ? (
    <Text numberOfLines={1} lineHeight="20" variant="sm">
      {artistNames}
    </Text>
  ) : null

  const saleMessageDisplay = saleMessage ? (
    <Text lineHeight="20" variant="xs" color="black60" numberOfLines={1}>
      {saleMessage}
    </Text>
  ) : null

  const titleAndDateDisplay =
    title || date ? (
      <Text lineHeight="20" color="black60" numberOfLines={1}>
        {[title, date].filter(Boolean).join(", ")}
      </Text>
    ) : null

  const partnerDisplay = partner?.name ? (
    <Text lineHeight="20" color="black60" numberOfLines={1}>
      {partner.name}
    </Text>
  ) : null

  const lotNumber = lotLabel ? (
    <Text lineHeight="20" color="black60" numberOfLines={1}>
      Lot {lotLabel}
    </Text>
  ) : null

  return (
    <ArtworkCard onPress={onPress || undefined} testID={testID}>
      <Flex>
        {imageDisplay}
        <Box mt={1} width={imageWidth}>
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
